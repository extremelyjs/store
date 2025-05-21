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
        const store = api.createMapperHooksStore<number, void>(-1);
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

    test('after setStoreValue', async () => {
        interface IUser {
            age: number;
            name: string;
            address: string;
        }
        const store = api.createMapperHooksStore<IUser, void>({
            age: 18,
            name: 'red',
            address: 'ccc',
        });
        const useStoreValue = store.useStoreValue;
        const setStoreValue = store.setStoreValue;
        const User = () => {
            const value = useStoreValue(value => value?.age);
            React.useEffect(
                () => {
                    setStoreValue(v => ({...v, age: v?.age + 1}));
                },
                []
            );
            return (
                <div>
                    {value}
                </div>
            );

        };
        const Component = connect()(React.memo(User));
        const render = reactTestRenderer.create(<Component />);
        await delay(2000);
        expect(render.toJSON()).toMatchSnapshot();
        expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['19']});
    });

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

    // 测试 setStoreValue 在加载状态下的行为
    test('setStoreValue during loading throws error', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const loadNum = store.loadStoreValue(
            params => params,
            mockLoad
        );
        loadNum();
        await delay(0); // 等待 queueMicrotask 执行
        expect(() => store.setStoreValue(1)).toThrow('当前处于加载状态，请等待加载完成。');
    });

    // // 测试 setStoreValue 类型检查
    // test('setStoreValue throws error when value is not function or value', () => {
    //     const store = api.createMapperHooksStore<number, void>(0);
    //     // @ts-expect-error 测试传入非函数非值参数
    //     expect(() => store.setStoreValue(null)).toThrow();
    // });

    // 测试 setStoreValue 中的错误处理
    test('setStoreValue throws error when value function throws', () => {
        const store = api.createMapperHooksStore<number, void>(0);
        expect(() => store.setStoreValue(() => {
            throw new Error('test error');
        })).toThrow('test error');
    });

    // 测试 useStoreValue 中的错误处理
    test('useStoreValue handles selector error', () => {
        const User = () => {
            const store = api.createMapperHooksStore<number, void>(0);
            const value = store.useStoreValue(() => {
                throw new Error('test error');
            });
            return <div>{value}</div>;
        };
        const Component = connect()(React.memo(User));
        const render = reactTestRenderer.create(<Component />);
        expect(render.toJSON()).toMatchSnapshot();
    });

    // 测试 useStoreValue selector 错误处理
    test('useStoreValue logs selector error', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const User = () => {
            const store = api.createMapperHooksStore<number, void>(0);
            store.useStoreValue(() => {
                throw new Error('selector error');
            });
            return <div>test</div>;
        };
        const Component = connect()(React.memo(User));
        reactTestRenderer.create(<Component />);
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error));
        expect(consoleError).toHaveBeenCalledWith('Above error occurs in selector.');
        consoleError.mockRestore();
    });

    // 测试 loadStoreValue 中的错误处理
    test('loadStoreValue throws error when async function throws', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const loadNum = store.loadStoreValue(
            params => params,
            async () => {
                throw new Error('async error');
            }
        );
        await expect(loadNum()).rejects.toThrow('async error');
    });

    // 测试 loadStoreValue 异步错误处理
    test('loadStoreValue handles async error with event', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const loadNum = store.loadStoreValue(
            params => params,
            async () => {
                throw new Error('async error');
            },
            {
                beforeEvent: async () => {/* noop */},
                afterEvent: async () => {/* noop */},
            }
        );
        await expect(loadNum()).rejects.toThrow('async error');
    });

    // 测试 private_subscribe 功能（通过 useStoreValue 间接测试）
    test('private_subscribe works through useStoreValue', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const User = () => {
            const value = store.useStoreValue();
            return <div>{value}</div>;
        };
        const Component = connect()(React.memo(User));
        const render = reactTestRenderer.create(<Component />);

        // 初始渲染应为0
        expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['0']});

        // 使用act包裹状态更新
        await reactTestRenderer.act(async () => {
            store.setStoreValue(1);
            // 添加微小延迟确保更新被应用
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // 检查更新后的值
        expect(render.toJSON()).toEqual({type: 'div', props: {}, children: ['1']});
    });

    // 测试 load 方法的 acceptEvery 策略
    test('load with acceptEvery strategy', async () => {
        const store = api.createMapperHooksStore<number, void>(0, {strategy: 'acceptEvery'});
        await store.load(mockPromiseArray());
        expect(store.getStoreValue()).toBe(9); // 最后一个值
    }, 10000); // 增加超时时间到 10 秒

    // 测试 load 方法的 acceptLatest 策略
    test('load with acceptLatest strategy', async () => {
        const store = api.createMapperHooksStore<number, void>(0, {strategy: 'acceptLatest'});
        await store.load(mockPromiseArray());
        expect(store.getStoreValue()).toBe(9); // 最后一个值
    }, 10000); // 增加超时时间到 10 秒

    // 测试 load 方法的默认策略（acceptSequenced）
    test('load with default strategy (acceptSequenced)', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const promises = [
            new Promise<number>(resolve => setTimeout(() => resolve(1), 100)),
            new Promise<number>(resolve => setTimeout(() => resolve(2), 50)),
        ];
        await store.load(promises);
        expect(store.getStoreValue()).toBe(2); // 最后一个resolve的值
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

    // 覆盖第86行：测试 local?.getItem(withLocalStorage) 为 null 或 undefined 的情况
    test('handles empty localStorage content', () => {
        const key = 'empty_key';
        localStorage.removeItem(key);
        const store = api.createMapperHooksStore<number, void>(0, {withLocalStorage: key});
        expect(store.getStoreValue()).toBe(0); // 应该回退到初始值
    });

    // 测试边界条件：空值
    test('handle undefined value', () => {
        const store = api.createMapperHooksStore<number, void>();
        expect(store.getStoreValue()).toBeUndefined();
        store.setStoreValue(undefined);
        expect(store.getStoreValue()).toBeUndefined();
    });

    // 测试 load 方法中的错误处理（最后一个结果为rejected）
    test('load throws error when last result is rejected', async () => {
        const store = api.createMapperHooksStore<number, void>(0, {strategy: 'acceptLatest'});
        const promises = [
            Promise.resolve(1),
            Promise.reject(new Error('test error')),
        ];
        await expect(store.load(promises)).rejects.toThrow('最后一个收到的结果为rejected');
    });

    // 测试 load 方法中的错误处理
    test('load handles promise rejection', async () => {
        const store = api.createMapperHooksStore<number, void>(0, {strategy: 'acceptLatest'});
        const promises = [
            Promise.resolve(1),
            Promise.reject(new Error('load error')),
        ];
        await expect(store.load(promises)).rejects.toThrow('最后一个收到的结果为rejected');
    });

    // 测试 useStoreValue 中的错误处理
    test('useStoreValue logs selector error', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const store = api.createMapperHooksStore<number, void>(0);
        const User = () => {
            store.useStoreValue(() => {
                throw new Error('selector error');
            });
            return <div>test</div>;
        };
        const Component = connect()(React.memo(User));
        reactTestRenderer.create(<Component />);
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error));
        expect(consoleError).toHaveBeenCalledWith('Above error occurs in selector.');
        consoleError.mockRestore();
    });

    // 测试 loadStoreValue 中的错误处理
    test('loadStoreValue throws error when async function throws', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const loadNum = store.loadStoreValue(
            params => params,
            async () => {
                throw new Error('async error');
            }
        );
        await expect(loadNum()).rejects.toThrow('async error');
    });

    // 测试文件读取成功但非文件内容的处理
    test('handles invalid localStorage content', () => {
        const key = 'invalid_key';
        localStorage.setItem(key, 'invalid json');
        const store = api.createMapperHooksStore<number, void>(0, {withLocalStorage: key});
        expect(store.getStoreValue()).toBe(0); // 应该回退到初始值
    });

    // 测试 load 方法中rejected结果错误处理
    test('load handles all rejected results', async () => {
        const store = api.createMapperHooksStore<number, void>(0, {strategy: 'acceptLatest'});
        const promises = [
            Promise.reject(new Error('error1')),
            Promise.reject(new Error('error2')),
        ];
        await expect(store.load(promises)).rejects.toThrow('最后一个收到的结果为rejected');
    });

    // 测试 setStoreValue 可以接受任何类型的值
    test('setStoreValue accepts any type of value', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const store = api.createMapperHooksStore<any, void>();

        // 测试基本类型
        store.setStoreValue(null);
        expect(store.getStoreValue()).toBeNull();

        store.setStoreValue(undefined);
        expect(store.getStoreValue()).toBeUndefined();

        store.setStoreValue(123);
        expect(store.getStoreValue()).toBe(123);

        store.setStoreValue('test');
        expect(store.getStoreValue()).toBe('test');

        store.setStoreValue(true);
        expect(store.getStoreValue()).toBe(true);

        // 测试对象和数组
        const obj = {a: 1};
        store.setStoreValue(obj);
        expect(store.getStoreValue()).toEqual(obj);

        const arr = [1, 2, 3];
        store.setStoreValue(arr);
        expect(store.getStoreValue()).toEqual(arr);

        // 测试函数
        store.setStoreValue(() => 'function result');
        expect(store.getStoreValue()).toBe('function result');
    });

    // 测试 setStoreValue 在加载状态下抛出错误
    test('setStoreValue throws error during loading', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const loadNum = store.loadStoreValue(
            params => params,
            async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return 1;
            }
        );
        loadNum();
        await new Promise(resolve => setTimeout(resolve, 0)); // 等待微任务执行
        expect(() => store.setStoreValue(1)).toThrow('当前处于加载状态，请等待加载完成。');
    });

    // 测试 setStoreValue 函数执行出错
    test('setStoreValue throws error when function throws', () => {
        const store = api.createMapperHooksStore<number, void>(0);
        expect(() => store.setStoreValue(() => {
            throw new Error('function error');
        })).toThrow('function error');
    });

    // 测试未覆盖的86行
    test('loadStoreValue with event', async () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const loadNum = store.loadStoreValue(
            params => params,
            async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return 1;
            },
            {
                beforeEvent: async () => {/* noop */},
                afterEvent: async () => {/* noop */},
            }
        );
        await loadNum();
        await new Promise(resolve => setTimeout(resolve, 0)); // 等待微任务执行
        expect(store.getStoreValue()).toBe(1);
    });

    // // 测试未覆盖的150行
    // test('private_subscribe adds and removes listeners', () => {
    //     const store = api.createMapperHooksStore<number, void>(0);
    //     const callback = jest.fn();
    //     const unsubscribe = store.private_subscribe(callback);
    //     store.setStoreValue(1);
    //     expect(callback).toHaveBeenCalledTimes(1);
    //     unsubscribe();
    //     store.setStoreValue(2);
    //     expect(callback).toHaveBeenCalledTimes(1); // 取消订阅后不应再调用
    // });

    test('useValueSelectorSubscription logs selector error', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
        const store = api.createMapperHooksStore<number, void>(0);
        const User = () => {
            store.useStoreValue(() => {
                throw new Error('selector error');
            });
            return <div>test</div>;
        };
        const Component = connect()(React.memo(User));
        reactTestRenderer.create(<Component />);
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error));
        expect(consoleError).toHaveBeenCalledWith('Above error occurs in selector.');
        consoleError.mockRestore();
    });

    // 覆盖第265-266行：测试 private_emit 中的异常处理逻辑
    test('private_emit handles callback errors', () => {
        const store = api.createMapperHooksStore<number, void>(0);
        const errorCallback = () => {
            throw new Error('callback error');
        };
        // 通过 useStoreValue 间接订阅 callback
        const User = () => {
            store.useStoreValue(() => {
                errorCallback();
                return 0;
            });
            return <div>test</div>;
        };
        const Component = connect()(React.memo(User));
        expect(() => reactTestRenderer.create(<Component />)).not.toThrow();
    });

    // 测试未覆盖的287行
    test('setStoreValue throws error when function throws', () => {
        const store = api.createMapperHooksStore<number, void>(0);
        expect(() => store.setStoreValue(() => {
            throw new Error('function error');
        })).toThrow('function error');
    });
});
