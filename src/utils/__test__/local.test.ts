// local.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getLocalObject} from '../local';

describe('getLocalObject function', () => {
    test('should return AsyncStorage when env is ReactNative', () => {
        const result = getLocalObject('ReactNative');
        expect(result).toBe(AsyncStorage);
    });

    test('should return localStorage when env is not ReactNative', () => {
        const result = getLocalObject();
        expect(result).toBe(localStorage);
    });
});
