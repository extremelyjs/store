import { useEffect, useState } from "react";
import { Func, Options, StoreType } from "./type";

/**
 * 获取值的类型变化
 *
 * @param currentType 当前值的类型
 * @param value 值
 * @returns 返回转换后的值
 */
const getChangeType = (currentType: string,value: any) => {
    switch (currentType) {
        case "string":
            return String(value);
        case "number":
            return Number(value);
        case "boolean":
            return Boolean(value);
        default:
            return value;
    }
}

/**
 * 创建一个状态管理
 *
 * @param reducer 状态处理函数
 * @param options 配置选项
 * @returns 返回 StoreType 类型对象
 */
function createStore<T = any>(reducer: Func,options?: Options): StoreType<T> {

    const hasLocalStorage = typeof localStorage !== "undefined";

    if (options?.withLocalStorage != null && !hasLocalStorage) {
        throw new Error("当前环境不支持loaclStorage");
    }

    const loaclStr = options?.withLocalStorage != null 
        ?  localStorage.getItem(options?.withLocalStorage || "")
        : null;
    
    let state: T | undefined = void 0;

    if (loaclStr != null) {
        let data = void 0;
        if (loaclStr?.startsWith("{")) {
            data = JSON.parse(loaclStr?.split("}:")[0]+ "}");
        }

        else if (loaclStr?.startsWith("[")) {
            data = JSON.parse(loaclStr?.split("]:")[0]+ "]");
        }

        else {
            data = getChangeType(loaclStr?.split(":")[1], loaclStr?.split(":")[0]);
        }

        state = data;
    }

    let listeners: Map<Symbol,Func> = new Map();
    let isDispatching = false;

    /**
     * 添加回调
     *
     * @param id 订阅者标识符
     * @param callback 回调函数，用于处理订阅的动作
     * @throws 当Reducer正在派发动作时，抛出错误"Reducer此时不得派发动作。"
     */
    function subscribe(id: Symbol,callback: Func) {
        if (isDispatching) {
            throw new Error("Reducer此时不得派发动作。");
        }
        listeners.set(id,callback);
    }

    /**
     * 取消订阅
     *
     * @param id 订阅的标识符
     * @throws 当正在派发动作时，调用此函数将抛出错误
     */
    function unSubscribe(id: Symbol) {
        if (isDispatching) {
            throw new Error("Reducer此时不得派发动作。");
        }

        listeners.delete(id);
    }

    /**
     * 派发 action 到 reducer，并更新 state。
     *
     * @param action 要派发的 action。
     * @throws 当 reducer 派发 action 时抛出错误。
     */
    function dispatch(action: any) {
        if (isDispatching) {
            throw new Error("Reducers may not dispatch actions.");
        }

        try {
            isDispatching = true;
            state = reducer(state, action);

            if (options != null && options?.withLocalStorage !== "") {
                localStorage.setItem(options?.withLocalStorage as string, JSON.stringify(state) + `:${typeof state}`);
            }
        }

        catch (error) {
            throw error;
        }

        finally {
            isDispatching = false;
        }

        listeners?.forEach((listener) => {
            listener();
        });
    }

    /**
     * 分发状态，用于index中的set(value)。
     *
     * @param value 状态值或生成状态值的函数。
     * @throws 当在分发动作时调用 Reducer 时抛出错误。
     */
    function dispatchState(value: T | Func) {
        if (isDispatching) {
            throw new Error("Reducers may not dispatch actions.");
        }

        try {
            if (typeof state === "function") {
                state = (value as Func)();
            }

            else {
                state = reducer(value);
            }

            if (options != null && options?.withLocalStorage !== "") {
                localStorage.setItem(options?.withLocalStorage as string, JSON.stringify(state) + `:${typeof state}`);
            }

            isDispatching = true;
        }

        catch (error) {
            throw error;
        }

        finally {
            isDispatching = false;
        }

        listeners?.forEach((listener) => {
            listener();
        });
    }

    /**
     * 用于set(callback)
     *
     * @param newReducer 用于更新状态的新 reducer 函数
     * @throws 当 reducer 分发 action 时抛出错误
     */
    function dispatchSlice(newReducer: Func) {
        if (isDispatching) {
            throw new Error("Reducers may not dispatch actions.");
        }

        try {
            state = newReducer(state);
            isDispatching = true;

            if (options != null && options?.withLocalStorage !== "") {
                localStorage.setItem(options?.withLocalStorage as string, JSON.stringify(state) + `:${typeof state}`);
            }

        }

        catch (error) {
            throw error;
        }

        finally {
            isDispatching = false;
        }

        listeners?.forEach((listener) => {
            listener();
        });
    }

    /**
     * 获取当前状态
     *
     * @returns 返回当前状态
     * @throws 如果当前正在派发动作，则抛出错误 "Reducer此时不得派发动作。"
     */
    function getState() {
        if (isDispatching) {
            throw new Error("Reducer此时不得派发动作。");
        }

        return state;
    }

    /**
     * 获取是否正在派发
     *
     * @returns 返回布尔值，表示是否正在派发
     */
    function getIsDispatching() {
        return loading;
    }

    let loading = isDispatching;

    /**
     * 设置是否正在派发状态
     *
     * @param dispatchState 是否正在派发状态的布尔值
     */
    function setIsDispatching(dispatchState: boolean) {
        loading = reducer(dispatchState);
        listeners?.forEach((listener) => {
            listener();
        });
    }

    const store = {
        subscribe,
        dispatch,
        getState,
        unSubscribe,
        getIsDispatching,
        setIsDispatching,
        dispatchState,
        dispatchSlice,
        loading
    }

    return store;
}

/**
 * 使用 selector 函数从 Redux Store 中选取状态，并在组件中使用。
 *
 * @param store Store 实例。
 * @param selector 从 store 中选取状态的函数。
 * @returns 选取到的状态值。
 */
const useSelector = (store: StoreType, selector: Func) => {
    const [selectedState, setSelectedState] = useState(() => selector(store.getState()));
    
    useEffect(() => {
        const id = Symbol();
        const callback = () => {
            setSelectedState(selector(store.getState()));
        };
        store.subscribe(id,callback);

        return () => {
            store.unSubscribe(id)
        };
    }, [store]);

    return selectedState;
}; 

// 已废弃
function createMapperStore<Params = any,Result = any>(
    {params, result}: {params: Params,result?: Result},
    reducer: Func,
) {
    const map = new Map<Params,{result:Result,listeners: Func[]}>();
    let listeners: Func[] = [];
    map.set(params, {result: result as Result,listeners});
    function subscribe(key: Params,callback: Func) {
        map.get(key)?.listeners?.push(callback);
    }
    function unSubscribe(key: Params,func: Func) {
        const index = map.get(key)?.listeners?.indexOf(func);
        map.get(key)?.listeners?.splice(index as number, 1);
    }
    function dispatch(key: Params, action: any) {
        const stateEntry = map.get(key);
        if (stateEntry) {
            stateEntry.result = reducer(stateEntry.result, action);
            stateEntry.listeners.forEach((listener) => {
                listener();
            });
        } else {
            console.warn(`Key ${key} 不存在于此store中。`);
        }
    }
    function getState(key: Params) {
        return map.get(key)?.result;
    }
    const store = {
        subscribe,
        dispatch,
        getState,
        unSubscribe
    }
    return store;
}

const useMapperSelector = <Params = any,Result = any>(store: any, key: Params, selector: Func): Result => {
    const [selectedState, setSelectedState] = useState(() => selector(store.getState(key)));
    useEffect(() => {
        const callback = () => {
            setSelectedState(selector(store.getState(key)));
        };
        store.subscribe(key, callback);
        return () => {
            store.unSubscribe(key, callback);
        };
    }, [store, key]); // 添加 key 到依赖数组中

    return selectedState;
};


export { createStore , useSelector , createMapperStore , useMapperSelector }