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
    useStoreValue: {
        (): T;
        <ResultType>(selector?: (value: T) => ResultType): ResultType;
    };
    setStoreValue: {
        (value: T): void;
        // eslint-disable-next-line @typescript-eslint/unified-signatures
        (func: Func<T>): void;
     };
    loadStoreValue: (params: Func<Params, Params>, func: Action<Params, Promise<T>>) => FuncPromise<Params>;
    getStoreValue: () => T;
    useStoreLoading: () => boolean;
    getStoreLoading: () => boolean;
    reset: () => void;
    load: (params: Array<Promise<T>>) => Promise<void>;
}

export interface HooksStorePureType<T = unknown, Params = unknown> extends Omit<HooksStoreType<T, Params>, 'loadStoreValue' | 'setStoreValue' | 'useStoreValue' | 'getStoreValue'> {
    useStoreValue: {
        (): T | undefined;
        <ResultType>(selector?: (value: T | undefined) => ResultType | undefined): ResultType | undefined;
    };
    getStoreValue: () => T | undefined;
    setStoreValue: {
        (value: T | undefined): void;
        // eslint-disable-next-line @typescript-eslint/unified-signatures
        (func: Func<T>): void;
     };
    loadStoreValue: (params: Func<Params, Params>, func: Action<Params, Promise<T>>) => FuncPromise<Params>;
}

type Strategy = 'acceptFirst' | 'acceptLatest' | 'acceptEvery' | 'acceptSequenced';

export interface Options {
    withLocalStorage?: string;
    strategy?: Strategy;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    local?: any;
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
