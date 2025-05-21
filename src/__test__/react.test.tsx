import React, {useEffect} from 'react';
import * as api from '..';

export async function mockLoad() {
    await new Promise(resolve => setTimeout(resolve, 10));
    return 1;
}

export function mockPromiseArray() {
    // 模拟十个异步任务，返回数字
    const arr: Array<Promise<number>> = [];
    for (let i = 0; i < 10; i++) {
        arr.push(new Promise(resolve => {
            setTimeout(() => resolve(i), 1000 * i);
        }));
    }
    return arr;
}

const numStore = api.createMapperHooksStore<number, void>(0);

export const useNum = numStore.useStoreValue;

export const setNum = numStore.setStoreValue;

export const resetNum = numStore.reset;

export const useNumLoading = numStore.useStoreLoading;

export const loadNum = numStore.loadStoreValue(
    params => params,
    mockLoad
);

export const getNumLoading = numStore.getStoreLoading;

export const loadAsyncQueueNum = numStore.load;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const connect = () => (Component: any) => {
    return () => {
        const loading = useNumLoading();
        const value = useNum();
        return <Component loading={loading} value={value} />;
    };
};

describe('react', () => {
    test('connect', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Component = connect()(React.memo(({value, loading}: any) => {
            return <div>{loading ? 'loading' : value}</div>;
        }));
        expect(Component).toBeTruthy();
    }, 10000);

    test('Subscribe to num value', () => {
        const Component = connect()(React.memo(() => {
            const value = useNum();
            expect(value).toBe(0);
            setNum(1);
            expect(value).toBe(1);
            setNum(v => v + 1);
            expect(value).toBe(2);
            return <div>{value}</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    test('reset', () => {
        const Component = connect()(React.memo(() => {
            setNum(1);
            const value = useNum();
            expect(value).toBe(1);
            resetNum();
            expect(value).toBe(0);
            return <div>{value}</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    test('loading', () => {
        const Component = connect()(React.memo(() => {
            const loading = useNumLoading();
            useEffect(
                () => {
                    loadNum();
                },
                []
            );
            expect(loading).toBeTruthy();
            return <div>{loading ? 'loading' : 'loaded'}</div>;
        }));
        expect(Component).toMatchSnapshot();
    }, 1000);

    test('loadQueue', () => {
        const Component = connect()(React.memo(() => {
            useEffect(
                () => {
                    loadAsyncQueueNum(mockPromiseArray());
                },
                []
            );
            return <div>loaded</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    test('load', () => {
        const Component = connect()(React.memo(() => {
            const value = useNum();
            useEffect(
                () => {
                    loadNum();
                },
                []
            );
            return <div>{value}</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    test('getLoading', () => {
        const Component = connect()(React.memo(() => {
            const loading = useNumLoading();
            expect(getNumLoading()).toBeTruthy();
            return <div>{loading ? 'loading' : 'loaded'}</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    test('useStoreValue', () => {
        const Component = connect()(React.memo(() => {
            const store = api.createMapperHooksStore<number, void>(0);
            const useStoreValue = store.useStoreValue;
            const value = useStoreValue();
            return <div>{value}</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    test('useStoreLoading', () => {
        const Component = connect()(React.memo(() => {
            const store = api.createMapperHooksStore<number, void>(0);
            const useStoreLoading = store.useStoreLoading;
            const loading = useStoreLoading();
            return <div>{loading}</div>;
        }));
        expect(Component).toMatchSnapshot();
    });

    // 测试 setNum 在加载状态下的行为
    test('setNum during loading throws error', async () => {
        function delay(time: number) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        loadNum();
        await delay(0); // 等待 queueMicrotask 执行
        expect(() => setNum(1)).toThrow('当前处于加载状态，请等待加载完成。');
    });

    // 测试本地存储功能
    test('withLocalStorage', () => {
        const key = 'test_key';
        const store = api.createMapperHooksStore<number, void>(0, {withLocalStorage: key});
        store.setStoreValue(1);
        const storedValue = JSON.parse(localStorage.getItem(key) || '{}');
        expect(storedValue.value).toBe('1');
        expect(storedValue.type).toBe('number');
    });

    // 测试边界条件：空值
    test('handle undefined value', () => {
        const store = api.createMapperHooksStore<number, void>();
        expect(store.getStoreValue()).toBeUndefined();
        store.setStoreValue(undefined);
        expect(store.getStoreValue()).toBeUndefined();
    });

});
