import {getChangeType} from '../getChangeType';

// 接下来是 Jest 单元测试
describe('getChangeType', () => {
    test('should return string when currentType is "string"', () => {
        expect(getChangeType('string', 123)).toBe('123');
        expect(getChangeType('string', true)).toBe('true');
        expect(getChangeType('string', 'hello')).toBe('hello');
    });

    test('should return number when currentType is "number"', () => {
        expect(getChangeType('number', '123')).toBe(123);
        expect(getChangeType('number', '123.45')).toBe(123.45);
        expect(getChangeType('number', 'invalid')).toBeNaN(); // 注意：NaN 与任何值都不相等，包括它自己
    });

    test('should return boolean when currentType is "boolean"', () => {
        expect(getChangeType('boolean', 'true')).toBe(true);
        expect(getChangeType('boolean', 'false')).toBe(false);
    });

    test('should return parsed object when currentType is "object"', () => {
        expect(getChangeType('object', '{"name": "John"}')).toEqual({name: 'John'});
        expect(getChangeType('object', '[{"name": "John"},{"name": "John"}]')).toEqual([
            {name: 'John'},
            {name: 'John'},
        ]);
    });

    test('should return undefined when currentType is undefined or not recognized', () => {
        expect(getChangeType(typeof undefined, 'undefined')).toBeUndefined();
    });
});
