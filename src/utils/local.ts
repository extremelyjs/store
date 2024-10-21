
/**
 * 获取本地对象
 *
 * @param local 自定义本地存储对象，如果传入null或undefined则使用localStorage
 * @returns 返回本地对象，如果local不为null或undefined则返回local，否则返回localStorage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalObject(local?: any) {
    if (local) {
        return local;
    }
    if (typeof localStorage !== 'undefined') {
        return localStorage;
    }
    return null;
}
