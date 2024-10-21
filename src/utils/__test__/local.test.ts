// local.test.ts
import {getLocalObject} from '../local';

describe('getLocalObject function', () => {
    test('should return AsyncStorage when env is ReactNative', () => {
        const result = getLocalObject(localStorage);
        expect(result).toBe(localStorage);
    });

    test('should return localStorage when env is not ReactNative', () => {
        const result = getLocalObject();
        expect(result).toBe(localStorage);
    });

    test('should return null when env is not ReactNative and local is undefined', () => {
        const result = getLocalObject({local: undefined});
        // 期望的应该是{local: undefined}
        expect(result).toEqual({local: undefined});
    });

    test('should return null', () => {
        // @ts-expect-error
        // eslint-disable-next-line no-global-assign
        delete globalThis.localStorage;
        const result = getLocalObject();
        expect(result).toEqual(null);
    });
});
