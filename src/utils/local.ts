/**
 * 从给定的local对象中获取本地存储对象，如果local为null或undefined则返回localStorage
 *
 * @param local 自定义的本地存储对象，如果为null或undefined则使用浏览器的localStorage
 * @returns 返回local对象或localStorage
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalObject(local?: any) {
    if (local) {
        return local;
    }
    return localStorage;
}
