import * as api from '..';
import {mockLoad, mockPromiseArray} from './react.test';

type TestObject = Record<string, number>;

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
});
