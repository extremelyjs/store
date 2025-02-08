import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import * as api from '..';


type TestObject = Record<string, number>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connect = () => (Component: any) => {
    return () => {
        return <Component />;
    };
};

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const connectWith = (key: any, Component: any) => connect(key)(Component);

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

describe('export api', () => {
    test(
        'should export api',
        () => {
            const {
                createMapperHooksStore,
            } = api;
            expect(createMapperHooksStore).toBeDefined();
            expect(typeof createMapperHooksStore).toBe('function');
        }
    );

    test('check store return', () => {
        const store = api.createMapperHooksStore();
        const {
            useStoreValue,
            setStoreValue,
            loadStoreValue,
            useStoreLoading,
            getStoreLoading,
            getStoreValue,
            load,
            reset,
        } = store;
        expect(store).toBeDefined();
        expect(useStoreValue).toBeDefined();
        expect(setStoreValue).toBeDefined();
        expect(loadStoreValue).toBeDefined();
        expect(useStoreLoading).toBeDefined();
        expect(getStoreLoading).toBeDefined();
        expect(getStoreValue).toBeDefined();
        expect(load).toBeDefined();
        expect(reset).toBeDefined();
    });

    test('reset', () => {
        const store = api.createMapperHooksStore<number, void>(5);
        store.setStoreValue(1);
        expect(store.getStoreValue()).toBe(1);
        store.reset();
        expect(store.getStoreValue()).toBe(5);
    });

    test('setStoreValue', () => {
        const store = api.createMapperHooksStore<TestObject>();
        store.setStoreValue({a: 1});
        expect(store.getStoreValue()).toEqual({a: 1});
        store.setStoreValue({b: 2});
        expect(store.getStoreValue()).toEqual({b: 2});
        store.setStoreValue(v => ({...v, c: 3}));
        expect(store.getStoreValue()).toEqual({b: 2, c: 3});
        store.setStoreValue(v => ({...v, b: 4}));
        expect(store.getStoreValue()).toEqual({b: 4, c: 3});
        expect(store.setStoreValue({})).toBeUndefined();
    });

    test('getStoreValue', () => {
        const store = api.createMapperHooksStore();
        expect(store.getStoreValue()).toBeUndefined();
        store.setStoreValue({a: 1});
        expect(store.getStoreValue()).toEqual({a: 1});
    });

    test('reset', () => {
        const store = api.createMapperHooksStore(0);
        store.setStoreValue(1);
        expect(store.getStoreValue()).toEqual(1);
        store.reset();
        expect(store.getStoreValue()).toBe(0);
    });

    test('loadStoreValue', async () => {
        const store = api.createMapperHooksStore(-1);
        store.load(mockPromiseArray());
        await delay(100);
        expect(store.getStoreValue()).not.toBe(-1);
    });

    test('load', async () => {
        const store = api.createMapperHooksStore<number, void>(-1);
        const loadNum = store.loadStoreValue(
            params => params,
            mockLoad
        );
        loadNum();
        await delay(1000);
        expect(store.getStoreValue()).not.toBe(-1);
    });

    test('getLoading', async () => {
        const store = api.createMapperHooksStore<number, void>(-1);
        expect(store.getStoreLoading()).toBeFalsy();
    });

    test('useStoreValue', () => {
        const User = () => {
            const store = api.createMapperHooksStore<number, void>(0);
            const value = store.useStoreValue();
            return (
                <div>
                    {value}
                </div>
            );

        };
        const Component = connect()(React.memo(User));
        expect(reactTestRenderer.create(<Component />).toJSON()).toMatchSnapshot();
        expect(reactTestRenderer.create(<Component />).toJSON()).toEqual({type: 'div', props: {}, children: ['0']});
    });

    test('after set', async () => {
        const User = () => {
            const store = api.createMapperHooksStore<number, void>(0);
            const value = store.useStoreValue();
            React.useEffect(() => {
                store.setStoreValue(2);
            }, [store]);
            return (
                <div>
                    {value}
                </div>
            );

        };
        const Component = connect()(React.memo(User));
        expect(reactTestRenderer.create(<Component />).toJSON()).toMatchSnapshot();
        expect(reactTestRenderer.create(<Component />).toJSON()).toEqual({type: 'div', props: {}, children: ['2']});
    });

    test('after loadStoreValue', async () => {
        const User = () => {
            const store = api.createMapperHooksStore<number, void>(0);
            const value = store.useStoreValue();
            const load = store.loadStoreValue(
                params => params,
                mockLoad
            );
            React.useEffect(() => {
                load();
            }, [load]);
            return (
                <div>
                    {value}
                </div>
            );

        };
        const Component = connect()(React.memo(User));
        const render = reactTestRenderer.create(<Component />);
        expect(render.toJSON()).toMatchSnapshot();
        expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['0']});
        await delay(100);
        expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['1']});
    });

    test('use selector', async () => {
        interface IUser {
            age: number;
            name: string;
            address: string;
        }
        const User = () => {
            const store = api.createMapperHooksStore<IUser, void>({
                age: 18,
                name: 'red',
                address: 'ccc',
            });
            const value = store.useStoreValue(value => value?.age);
            React.useEffect(() => {
                store.setStoreValue(v => (
                    {
                        ...v,
                        name: 'yellow',
                    }
                ));
            }, [store]);
            return (
                <div>
                    {value}
                </div>
            );

        };
        const Component = connect()(React.memo(User));
        const render = reactTestRenderer.create(<Component />);
        expect(render.toJSON()).toMatchSnapshot();
        expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['18']});
    });

    // test('after setStoreValue', async () => {
    //     interface IUser {
    //         age: number;
    //         name: string;
    //         address: string;
    //     }
    //     const User = () => {
    //         const store = api.createMapperHooksStore<IUser, void>({
    //             age: 18,
    //             name: 'red',
    //             address: 'ccc',
    //         });
    //         const value = store.useStoreValue(value => value?.age);
    //         React.useEffect(
    //             () => {
    //                 store.setStoreValue(v => ({...v, age: v?.age + 1}));
    //             },
    //             [store]
    //         );
    //         return (
    //             <div>
    //                 {value}
    //             </div>
    //         );

    //     };
    //     const Component = connect()(React.memo(User));
    //     const render = reactTestRenderer.create(<Component />);
    //     await delay(2000);
    //     expect(render.toJSON()).toMatchSnapshot();
    //     expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['19']});
    // });

    test('useStoreLoading', () => {
        const User = () => {
            const store = api.createMapperHooksStore<number, void>(0);
            const isLoading = store.useStoreLoading();
            return (
                <div>
                    {isLoading}
                </div>
            );
        };
        const Component = connect()(React.memo(User));
        expect(reactTestRenderer.create(<Component />).toJSON()).toMatchSnapshot();
    });
});
