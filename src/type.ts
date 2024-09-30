export type Func<T = unknown, V = unknown> = (...args: T[]) => V;

export type Action<T = unknown, V = unknown> = (...args: T[]) => V;

export type FuncPromise<T = unknown> = (data: T) => Promise<void>;

export interface StoreType<T = unknown> {
    subscribe: (id: symbol, callback: Func) => void;
    dispatch: (action?: unknown) => void;
    dispatchState: (state: T | Func) => void;
    getState: () => T | undefined;
    unSubscribe: (id: symbol) => void;
    getIsDispatching: () => boolean;
    setIsDispatching: (e: boolean) => void;
    dispatchSlice: (slice: Func) => void;
}
export interface HooksStoreType<T = unknown, Params = unknown> {
    useStoreValue: () => T | undefined;
    setStoreValue: {
        (value: T | undefined): void;
        // eslint-disable-next-line @typescript-eslint/unified-signatures
        (func: Func<T>): void;
     };
    loadStoreValue: (params: Func<Params, T>, func: Action<T, Promise<T>>) => FuncPromise<Params>;
    getStoreValue: () => T | undefined;
    useStoreLoading: () => boolean;
    getStoreLoading: () => boolean;
    reset: () => void;
    load: (params: Array<Promise<T>>) => Promise<void>;
}

type Strategy = 'acceptFirst' | 'acceptLatest' | 'acceptEvery' | 'acceptSequenced';

export interface Options {
    withLocalStorage?: string;
    strategy?: Strategy;
    isReactNative?: boolean;
}

export interface Ref<Result = unknown, Params = unknown> {
    loading: boolean;
    value: Result | undefined;
    promiseQueue: Map<string, Array<Promise<Result>>>;
    error: Map<string, Error>;
    listeners: Map<symbol, Func>;
    params?: Params;
}

export type Listener = () => void;
