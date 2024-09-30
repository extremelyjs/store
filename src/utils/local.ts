import AsyncStorage from '@react-native-async-storage/async-storage';
import {Environment} from './env';

export function getLocalObject(env: Environment = 'web') {
    if (env === 'ReactNative') {
        return AsyncStorage;
    }
    return localStorage;
}
