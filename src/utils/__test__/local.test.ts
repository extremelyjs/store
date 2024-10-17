// local.test.ts
import {getLocalObject} from '../local';

describe('getLocalObject function', () => {
    test('should return AsyncStorage when env is ReactNative', () => {
        const result = getLocalObject();
        expect(result).toBe(localStorage);
    });

    test('should return localStorage when env is not ReactNative', () => {
        const result = getLocalObject(localStorage);
        expect(result).toBe(localStorage);
    });
});
