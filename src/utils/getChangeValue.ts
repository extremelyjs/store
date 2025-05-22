/**
 * 根据传入的字符串值获取布尔值
 *
 * @param value 字符串值，必须为 'true' 或 'false'
 * @returns 返回对应的布尔值，true 或 false
 * @throws 当传入的字符串值不是 'true' 或 'false' 时，抛出错误 'Invalid boolean value'
 */
export function getBooleanValue(value: 'true' | 'false') {
    if (value === 'true') {
        return true;
    }
    else if (value === 'false') {
        return false;
    }
    throw new Error('Invalid boolean value');
}

/**
 * 获取值的类型变化
 *
 * @param currentType 当前值的类型
 * @param value 值
 * @returns 返回转换后的值
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getChangeValue = (currentType: string | undefined, value: any) => {
    switch (currentType) {
        case 'string':
            return String(value);
        case 'number':
            return Number(value);
        case 'boolean':
            return getBooleanValue(value);
        case 'object':
            return JSON.parse(value);
        default:
            return undefined;
    }
};
