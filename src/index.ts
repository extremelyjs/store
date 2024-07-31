import { useEffect, useState } from "react"
import { Action, Func, HooksStoreType, Options } from "./type"
import { createStore, useSelector } from "./core"

const createMapperHooksStore = <Result = any,T = any>(initValue?: Result,options?: Options): HooksStoreType<Result,T> => {

    const store = createStore(e => e,options)
    let hasLocalStorage = false;
    if (typeof localStorage !== 'undefined') {
        hasLocalStorage = true;
    }
    else if (options?.withLocalStorage != null) {
        throw new Error("当前环境不支持loaclStorage");
    }
    if (hasLocalStorage) {
        if (initValue != null && localStorage.getItem(options?.withLocalStorage as string) == null) {
            setStoreValue(initValue)
        }
        else {
            setStoreValue(store.getState())
        }
    }
    else {
        setStoreValue(initValue);
    }
    function useStoreValue() {
        const storeValue = useSelector(store,state => state)
        return storeValue
    }
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
        reset
    }
}

export { createMapperHooksStore }