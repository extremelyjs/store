import {useMemo} from 'react';
import {useSyncExternalStore} from 'use-sync-external-store/shim';
import {Options, Ref, HooksStoreType, Func, Action, Listener} from './type';
import {getLocalObject} from './utils/local';
import {getChangeType} from './utils/getChangeType';


/**
 * 创建一个用于存储和管理映射关系的 HooksStore
 *
 * @param initValue 初始值
 * @param options 配置选项
 * @returns 返回 HooksStoreType 类型的对象，包含多个用于操作数据的函数和方法
 */
export function createMapperHooksStore<Result = unknown, Params = unknown>(
    initValue?: Result,
    options?: Options
): HooksStoreType<Result, Params> {
    const withLocalStorage = options?.withLocalStorage ?? '';
    let curValue = initValue;
    const local = getLocalObject(options?.isReactNative ? 'ReactNative' : 'web');
    if (typeof local !== 'undefined' && withLocalStorage !== '') {
        const token = !local.getItem(withLocalStorage) ? '{"value": "","type": "other"}' : local.getItem(withLocalStorage);
        const obj = JSON.parse(token as string);
        curValue = getChangeType(obj.type, obj.value) ?? undefined;
    }
    const ref: Ref<Result, Params> = {
        // loading后续可以自定义
        loading: false,
        // 后续可以换成Map结构，减少数据冗余。
        value: curValue ?? initValue ?? undefined,
        promiseQueue: new Map<string, Array<Promise<Result>>>(),
        error: new Map<string, Error>(),
        listeners: new Map<symbol, Func>(),
    };
    const strategy = options?.strategy ?? 'acceptSequenced';

    /**
     * 获取存储的值
     *
     * @returns 返回存储的值
     */
    function getStoreValue() {
        return ref.value;
    }

    /**
     * 获取存储加载状态
     *
     * @returns 返回存储加载状态
     */
    function getStoreLoading() {
        return ref.loading;
    }

    /**
     * 订阅事件
     *
     * @param 添加一个callback到队列里
     * @returns 返回一个函数，用于取消
     * @throws 当callback不是函数时，抛出错误
     */
    function subscribe(callback: Func) {
        if (typeof callback === 'function') {
            const key = Symbol('id');
            ref.listeners.set(key, callback);

            return () => {
                ref.listeners.delete(key);
            };
        }
        else {
            throw new Error('callback应该是个函数。');
        }
    }

    /**
     * 参考useSyncExternalStore里的入参
     *
     * @returns 返回一个包含getCurrentValue和subscribeFunc的对象，用于useSyncExternalStore里的参数
     */
    const useValueSelectorSubscription = () => {
        const subscription = useMemo(
            () => (
                {
                    getCurrentValue: () => getStoreValue(),
                    subscribeFunc: (listener: Listener) => subscribe(listener),
                }
            ),
            []
        );

        return subscription;
    };

    /**
     * 参考useSyncExternalStore里的入参
     *
     * @returns 返回一个包含getCurrentLoading和subscribeFunc的对象，用于useSyncExternalStore里的参数
     */
    const useLoadingSelectorSubscription = () => {
        const subscription = useMemo(
            () => (
                {
                    getCurrentLoading: () => getStoreLoading(),
                    subscribeFunc: (listener: Listener) => subscribe(listener),
                }
            ),
            []
        );

        return subscription;
    };

    /**
     * 触发事件，执行注册的所有回调函数
     */
    function emit() {
        ref?.listeners?.forEach(callback => {
            try {
                callback();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                throw new Error(error);
            }
        });
    }

    /**
     * 设置存储值
     *
     * @param value 可以传value或者回调
     * @throws 当当前处于加载状态时，抛出错误提示
    */
    function setStoreValue(value: Result | undefined): void;
    function setStoreValue(func: Func<Result>): void;
    function setStoreValue(value: Result | Func<Result> | undefined) {
        if (ref.loading) {
            throw new Error('当前处于加载状态，请等待加载完成。');
        }
        if (typeof value === 'function') {
            try {
                ref.value = (value as Func<Result | undefined, Result | undefined>)(ref.value);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                throw new Error(error);
            }
        }
        else {
            try {
                ref.value = value;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                throw new Error(error);
            }
        }
        if (typeof local !== 'undefined' && withLocalStorage !== '') {
            const obj = {
                value: typeof ref.value === 'string' ? ref.value : JSON.stringify(ref.value),
                type: typeof ref.value,
            };
            local.setItem(`${withLocalStorage}`, JSON.stringify(obj));
        }
        emit();
    }

    /**
     * 订阅store value
     *
     * @returns 返回同步后的store值
     */
    function useStoreValue() {
        const subscription = useValueSelectorSubscription();
        return useSyncExternalStore(subscription.subscribeFunc, subscription.getCurrentValue);
    }

    /**
     * 订阅异步请求更新加载状态
     *
     * @returns 返回加载状态的同步外部存储
     */
    function useStoreLoading() {
        const subscription = useLoadingSelectorSubscription();
        return useSyncExternalStore(subscription.subscribeFunc, subscription.getCurrentLoading);
    }

    /**
     * 加载存储值
     *
     * @param params 函数类型，参数为Params类型，返回值为Result类型
     * @param func 函数类型，参数为Result类型，返回值为Promise<Result>类型
     * @returns 返回一个异步函数，参数为Params类型，无返回值
     */
    function loadStoreValue(params: Func<Params, Result>, func: Action<Result, Promise<Result>>) {
        // eslint-disable-next-line no-underscore-dangle
        async function _loadStoreValue(data: Params) {
            try {
                queueMicrotask(() => {
                    // 设置loading
                    ref.loading = true;
                });

                func(params(data)).then(value => {
                    ref.loading = false;
                    setStoreValue(value);
                });

            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                throw new Error(error);
            }
        }

        return _loadStoreValue;
    }

    /**
     * 加载Promise队列并处理结果
     *
     * @param promiseQueue Promise队列
     * @returns 无返回值
     */
    async function load(promiseQueue: Array<Promise<Result>>) {
        if (strategy === 'acceptEvery') {
            const result = await Promise.all(promiseQueue);
            result?.map(
                item => setStoreValue(item)
            );
        }

        else if (strategy === 'acceptFirst') {
            const result = await Promise.race(promiseQueue);
            setStoreValue(result);
        }

        else if (strategy === 'acceptLatest') {
            const result = await Promise.allSettled(promiseQueue);
            const lastResult = result.pop();
            if (lastResult?.status === 'fulfilled') {
                setStoreValue(lastResult.value);
            }
            else {
                throw new Error('最后一个收到的结果为rejected');
            }
        }

        else {
            promiseQueue.forEach((item, index) => {
                item.then(value => {
                    setStoreValue(value);
                });
                promiseQueue.slice(index + 1);
            });
        }
    }

    /**
     * 重置函数
     *
     * @description 将 ref 的值重置为初始值
     */
    function reset() {
        ref.value = initValue;
    }

    return {
        useStoreValue,
        setStoreValue,
        loadStoreValue,
        useStoreLoading,
        getStoreLoading,
        getStoreValue,
        load,
        reset,
    };
}
