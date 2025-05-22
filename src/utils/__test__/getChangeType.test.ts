import {getChangeValue} from '../getChangeValue';

// 接下来是 Jest 单元测试
describe('getChangeValue', () => {
    test('should return string when currentType is "string"', () => {
        expect(getChangeValue('string', 123)).toBe('123');
        expect(getChangeValue('string', true)).toBe('true');
        expect(getChangeValue('string', 'hello')).toBe('hello');
    });

    test('should return number when currentType is "number"', () => {
        expect(getChangeValue('number', '123')).toBe(123);
        expect(getChangeValue('number', '123.45')).toBe(123.45);
        expect(getChangeValue('number', 'invalid')).toBeNaN(); // 注意：NaN 与任何值都不相等，包括它自己
    });

    test('should return boolean when currentType is "boolean"', () => {
        expect(getChangeValue('boolean', 'true')).toBe(true);
        expect(getChangeValue('boolean', 'false')).toBe(false);
    });

    test('should return parsed object when currentType is "object"', () => {
        expect(getChangeValue('object', '{"name": "John"}')).toEqual({name: 'John'});
        expect(getChangeValue('object', '[{"name": "John"},{"name": "John"}]')).toEqual([
            {name: 'John'},
            {name: 'John'},
        ]);
    });

    test('should return undefined when currentType is undefined or not recognized', () => {
        expect(getChangeValue(typeof undefined, 'undefined')).toBeUndefined();
    });
});
