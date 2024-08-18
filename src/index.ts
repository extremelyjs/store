import { useEffect, useState } from "react";
import { Options, Ref, HooksStoreType, Func, Action } from "./type";


/**
 * 获取值的类型变化
 *
 * @param currentType 当前值的类型
 * @param value 值
 * @returns 返回转换后的值
 */
const getChangeType = (currentType: string | undefined,value: any) => {
    switch (currentType) {
        case "string":
            return String(value);
        case "number":
            return Number(value);
        case "boolean":
            return Boolean(value);
        case "object":
            return JSON.parse(value);
        default:
            return value;
    }
}

export function createMapperHooksStore<Result = unknown, Params = unknown>(
    initValue?: Result,
    options?: Options
): HooksStoreType<Result, Params> {
    // 新版的loaclstorage支持暂时不做
    const withLocalStorage = options?.withLocalStorage ?? "";
    let curValue = initValue;
    if (typeof localStorage !== "undefined" && withLocalStorage !== "") {
        const token = localStorage.getItem(withLocalStorage)?.split("/");
        curValue = getChangeType(token?.[1],token?.[0]) ?? void 0;
    }
    const ref: Ref<Result, Params> = {
        // loading后续可以自定义
        loading: false,
        // 后续可以换成Map结构，减少数据冗余。
        value: curValue ?? initValue ?? void 0,
        promiseQueue: new Map<string, Array<Promise<Result>>>(),
        error: new Map<string, Error>(),
        listeners: new Map<symbol, Func>(),
    }
    const strategy = options?.strategy ?? "acceptSequenced";

    function subscribe(callback: Func) {
        if (typeof callback === "function") {
            const key = Symbol();
            ref.listeners.set(key, callback);

            return () => {
                ref.listeners.delete(key)
            }
        }
        else {
            throw new Error("callback应该是个函数。")
        }
    }

    function emit() {
        ref?.listeners?.forEach((callback) => {
            try {
                callback();
            } catch (error: any) {
                throw new Error(error)
            }
        })
    }

    function setStoreValue(value: Result | undefined): void
    function setStoreValue(func: Func<Result>): void
    function setStoreValue(value: Result | Func<Result> | undefined) {
        if (typeof value === 'function') {
            try {
                ref.value = (value as Func<Result | undefined>)(ref.value);
            }
            catch (error: any) {
                throw new Error(error)
            }
        }
        else {
            try {
                ref.value = value;
            }
            catch (error: any) {
                throw new Error(error)
            }
        }
        if (typeof localStorage !== "undefined" && withLocalStorage !== "") {
            localStorage.setItem(`${withLocalStorage}`, JSON.stringify(ref.value) + `/${typeof ref.value}`);
        }
        emit();
    }

    function getStoreValue() {
        return ref.value;
    }

    function getLoading() {
        return ref.loading;
    }

    function useStoreValue() {
        const [selectedState, setSelectedState] = useState<Result | undefined>(ref.value);

        useEffect(
            () => {
                const callback = () => {
                    setSelectedState(getStoreValue());
                };
                const unSubscribe = subscribe(callback);

                return () => {
                    unSubscribe()
                };

            },
            [ref.value]
        );

        return selectedState;
    }

    function useStoreLoading() {
        const [loading, setLoading] = useState<boolean>(ref.loading);

        useEffect(
            () => {
                setLoading(getLoading());
            },
            [ref.loading]
        );

        return loading;
    }

    function getStoreLoading() {
        return ref.loading;
    }

    function loadStoreValue(params: Func<Params>,func: Action<Result,Promise<Result>>) {
        async function _loadStoreValue(data: Params) {
            try {
                queueMicrotask(() => {
                    // 设置loading
                    ref.loading = true;
                });

                func(params(data)).then((value) => {
                    ref.loading = false;
                    setStoreValue(value)
                })

            }
            catch (error: any) {
                throw new Error(error)
            }
        }

        return _loadStoreValue
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
    }
}