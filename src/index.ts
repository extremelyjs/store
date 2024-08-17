import { useEffect, useState } from "react"
import { Action, Func, HooksStoreType, Options } from "./type"
import { createStore, useSelector } from "./core"

/**
 * store的hooks实现
 *
 * @param initValue 初始值
 * @param options 配置选项
 * @returns 返回一个包含多个方法的对象，用于操作存储
 * @template Result 存储结果的类型
 * @template T 参数的类型
 */
const createMapperHooksStore = <Result = any,T = any>(initValue?: Result,options?: Options): HooksStoreType<Result,T> => {
    const store = createStore(e => e,options)
    const strategy = options?.strategy ?? 'acceptSequenced';
    let hasLocalStorage = false;

    if (typeof localStorage !== 'undefined') {
        hasLocalStorage = true;
    }

    else if (options?.withLocalStorage != null) {
        throw new Error("当前环境不支持loaclStorage");
    }

    if (hasLocalStorage) {
        if (initValue != null && localStorage.getItem(options?.withLocalStorage as string) == null) {
            setStoreValue(initValue);
        }

        else {
            setStoreValue(initValue);
        }

    }

    else {
        setStoreValue(initValue);
    }

    /**
     * 订阅 store 中的值
     *
     * @returns store 中的值
     */
    function useStoreValue() {
        const storeValue = useSelector(store,state => state)
        return storeValue
    }

    /**
     * 设置存储值
     *
     * @param value 结果或结果生成函数，或undefined
     * @throws 如果在设置过程中发生错误，则抛出错误
    */
    function setStoreValue(value: Result | undefined): void
    function setStoreValue(func: Func<Result>): void
    function setStoreValue(value: Result | Func<Result> | undefined) {
        if (typeof value === 'function') {
            try {
                store.setIsDispatching(true);
                store.dispatchSlice((value as Func<Result>))
                store.setIsDispatching(false)
            }
            catch (error: any) {
                throw new Error(error)
            }
        }
        else {
            try {
                store.setIsDispatching(true);
                store.dispatchState(value);
                store.setIsDispatching(false);
            }
            catch (error: any) {
                throw new Error(error)
            }
        }
    }

    /**
     * 加载异步请求并更新
     *
     * @param params 参数函数
     * @param func 异步操作函数
     * @returns 返回加载存储值的函数
     */
    function loadStoreValue(params: Func<T>,func: Action<Result,Promise<Result>>) {
        async function _loadStoreValue(data: T) {
            try {
                queueMicrotask(() => {
                    store.setIsDispatching(true);
                });

                func(params(data)).then((value) => {
                    store.setIsDispatching(false)
                    setStoreValue(value)
                })

            }
            catch (error: any) {
                throw new Error(error)
            }
            finally {
                store.setIsDispatching(false)
            }
        }

        return _loadStoreValue
    }

    function getStoreValue() {
        return store.getState()
    }


    /**
     * 订阅更新态
     *
     * @returns 返回一个boolean值
     */
    function useStoreLoading() {
        const [loading, setLoading] = useState(store.getIsDispatching());

        useEffect(() => {
            const callback = () => {
                setLoading(store.getIsDispatching());
            };
            const id = Symbol();
            store.subscribe(id,callback);
            return () => {
                store.unSubscribe(id)
            };
        }, [store]);

        return loading;
    }

    function getStoreLoading() {
        return store.getIsDispatching()
    }

    /**
     * 加载Promise队列并处理结果
     *
     * @param promiseQueue Promise队列
     * @returns 无返回值
     */
    async function load(promiseQueue: Promise<Result>[]) {
        if (strategy === 'acceptEvery') {
             const result = await Promise.all(promiseQueue);
             result?.map((item) => {
                 setStoreValue(item);
             })
        }

        else if (strategy === "acceptFirst") {
            const result = await Promise.race(promiseQueue);
            setStoreValue(result);
        }

        else if (strategy === "acceptLatest") {
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
            promiseQueue.forEach((item,index) => {
                item.then((value) => {
                    setStoreValue(value);
                })
                promiseQueue.slice(index + 1);
            });
        }
    }

    function reset() {
        setStoreValue(initValue)
    }

    return {
        useStoreValue,
        setStoreValue,
        loadStoreValue,
        getStoreValue,
        useStoreLoading,
        getStoreLoading,
        reset,
        load
    }
}

export { createMapperHooksStore }