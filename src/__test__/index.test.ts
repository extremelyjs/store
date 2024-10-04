import * as api from '..';

type TestObject = Record<string, number>;

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
});
