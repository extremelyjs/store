export type Func<T = any> = (...args: T[]) => any;

export type Action<T = any, V = any> = (...args: T[]) => V;

export type FuncPromise<T = any> = (data: T) => Promise<void>;

export interface StoreType<T = any> {
    subscribe: (id:Symbol,callback: Func) => void;
    dispatch: (action?: any) => void;
    dispatchState: (state: T | Func) => void;
    getState: () => T | undefined;
    unSubscribe: (id: Symbol) => void;
    getIsDispatching: () => boolean;
    setIsDispatching: (e: boolean) => void;
    dispatchSlice: (slice: Func) => void;
}
export interface HooksStoreType<T = any,Params = any> {
    useStoreValue: () => T | undefined;
    setStoreValue: { (value: T | undefined): void; (func: Func<T>): void; }
    loadStoreValue: (params: Func<Params>,func: Action) => FuncPromise<Params>
    getStoreValue: () => T | undefined;
    useStoreLoading: () => boolean;
    getStoreLoading: () => boolean;
    reset: () => void;
    load: (params: Promise<T>[]) => Promise<void>;
}

type Strategy = "acceptFirst" | "acceptLatest" | "acceptEvery" | "acceptSequenced";

export interface Options {
    withLocalStorage?: string;
    strategy?: Strategy
}

export interface Ref<Result = unknown,Params = unknown> {
    loading: boolean;
    value: Result | undefined;
    promiseQueue: Map<string, Promise<Result>[]>;
    error: Map<string, Error>;
    listeners: Map<symbol, Func>;
}