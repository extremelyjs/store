import {getBooleanValue} from '../getChangeValue';

describe('getChangeValue', () => {
    test('getBooleanValue should return true when input is "true"', () => {
        expect(getBooleanValue('true')).toBe(true);
    });

    test('getBooleanValue should return false when input is "false"', () => {
        expect(getBooleanValue('false')).toBe(false);
    });

    test('getBooleanValue should throw an error when input is not "true" or "false"', () => {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '""' is not assignable to parameter of typ...
        expect(() => getBooleanValue('')).toThrow('Invalid boolean value');
    });
});
