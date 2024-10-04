import AsyncStorage from '@react-native-async-storage/async-storage';
import {Environment} from './env';

/**
 * 获取本地对象
 *
 * @param env 环境类型，默认为 'web'
 * @returns 返回本地对象，如果环境类型为 'ReactNative'，则返回 AsyncStorage 对象，否则返回 localStorage 对象
 */
export function getLocalObject(env: Environment = 'web') {
    if (env === 'ReactNative') {
        return AsyncStorage;
    }
    return localStorage;
}
