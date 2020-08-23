import BigNumber from 'bignumber.js';
import { fromNumber, fromString, StandardBaseConverter } from './base-converter';
import { Digit } from '@calc/calc-arithmetic';

describe('StandardBaseConverter fromNumber tests', () => {
    const BaseConverter = new StandardBaseConverter();

    it('converts positive floating base 10 to base 2', () => {
        // given
        const input = new BigNumber(25.5);
        const radix = 2;
        const expected = '11001.1';
        const expectedComplement = '(0)11001.1';

        // when
        const result = BaseConverter.fromNumber(input, radix).result;

        // then
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts negative floating base 10 to base 2', () => {
        // given
        const input = new BigNumber(-25.5);
        const radix = 2;
        const expected = '-11001.1';
        const expectedComplement = '(1)00110.1';

        // when
        const result = BaseConverter.fromNumber(input, radix).result;
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive base 10 to base 16', () => {
        // given
        const input = new BigNumber(255);
        const radix = 16;
        const expected = 'FF';
        const expectedComplement = '(0)FF';

        // when
        const result = BaseConverter.fromNumber(input, radix).result;

        // then
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive floating base 10 to base 16', () => {
        // given
        const input = new BigNumber(255.5);
        const radix = 16;
        const expected = 'FF.8';
        const expectedComplement = '(0)FF.8';

        // when
        const result = BaseConverter.fromNumber(input, radix).result;

        // then
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive floating base 10 to base 2 from number', () => {
        // given
        const input = 25.5;
        const radix = 2;
        const expected = '11001.1';
        const expectedComplement = '(0)11001.1';

        // when
        const result = BaseConverter.fromNumber(input, radix).result;

        // then
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });
});

describe('StandardBaseConverter fromString tests', () => {
    const BaseConverter = new StandardBaseConverter();

    it('converts positive base 2 integer to base 10', () => {
        // given
        const input = '11001';
        const inputRadix = 2;
        const outputRadix = 10;
        const expected = new BigNumber(25);
        const expectedComplement = '(0)25';

        // when
        const result = BaseConverter.fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts negative base 2 integer to base 10', () => {
        // given
        const input = '-11001';
        const inputRadix = 2;
        const outputRadix = 10;
        const expected = new BigNumber(-25);
        const expectedComplement = '(9)75';

        // when
        const result = BaseConverter.fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive floating base 2 to base 10', () => {
        // given
        const input = '11001.1';
        const inputRadix = 2;
        const outputRadix = 10;
        const expected = new BigNumber(25.5);
        const expectedComplement = '(0)25.5';

        // when
        const result = BaseConverter.fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
        expect(result.complement.toString()).toEqual(expectedComplement);
    });
    it('converts negative floating base 2 to base 10', () => {
        // given
        const input = '-11001.1';
        const inputRadix = 2;
        const outputRadix = 10;
        const expected = new BigNumber(-25.5);
        const expectedComplement = '(9)74.5';

        // when
        const result = BaseConverter.fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
        expect(result.complement.toString()).toEqual(expectedComplement);
    });
    it('converts positive floating base 16 to base 10', () => {
        // given
        const input = 'FF.8';
        const inputRadix = 16;
        const outputRadix = 10;
        const expected = new BigNumber(255.5);
        const expectedComplement = '(0)255.5';

        // when
        const result = BaseConverter.fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
        expect(result.complement.toString()).toEqual(expectedComplement);
    });
    it('converts negative floating base 16 to base 10', () => {
        // given
        const input = '-FF.8';
        const inputRadix = 16;
        const outputRadix = 10;
        const expected = new BigNumber(-255.5);
        const expectedComplement = '(9)744.5';

        // when
        const result = BaseConverter.fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
        expect(result.complement.toString()).toEqual(expectedComplement);
    });
    it('converts positive floating base 2 to base 8', () => {
        // given
        const input = '11001.1';
        const inputRadix = 2;
        const outputRadix = 8;
        const expected = new BigNumber(25.5);
        const expectedValueStr = '31.4';

        // when
        const conv = BaseConverter.fromString(input, inputRadix, outputRadix);
        const result = conv.result;

        // then
        expect(result.decimalValue).toEqual(expected);
        expect(result.valueInBase).toEqual(expectedValueStr);
        expect(true).toBeTruthy();
    });

    it('throws error if repStr does match input radix', () => {
        // given
        const input = '-FF8.923';
        const inputRadix = 10;
        const outputRadix = 16;

        // then
        expect(() => {
            BaseConverter.fromString(input, inputRadix, outputRadix);
        }).toThrow();
    });


    // ISSUE_ID: 5
    describe('fromString conversion', () => {
        // given
        const input = '24';
        const inputRadix = 10;
        const outputRadix = 2;
        const stagesLength = 2;

        it('should generate 2 conversion stages for conversions', () => {
            // when
            const result = BaseConverter.fromString(input, inputRadix, outputRadix);

            // then
            expect(result.stages.length).toEqual(stagesLength);
        });

        it('should generate first conversion stage from string to base 10 number', () => {
            // when
            const result = BaseConverter.fromString(input, inputRadix, outputRadix);
            const firstStage = result.getFirstStage();
            const expectedInput = [input, inputRadix];

            // then
            expect(firstStage.input).toEqual(expectedInput);
            expect(firstStage.result.valueInBase).toEqual(input);
            expect(firstStage.result.base).toEqual(inputRadix);
        });

        it('should generate second conversion stage base 10 number to target base', () => {
            // when
            const result = BaseConverter.fromString(input, inputRadix, outputRadix);
            const secondStage = result.getLastStage();
            const expectedInput = [input, inputRadix];
            const valueInBase = '11000';

            // then
            expect(secondStage.input).toEqual(expectedInput);
            expect(secondStage.result.valueInBase).toEqual(valueInBase);
            expect(secondStage.result.base).toEqual(outputRadix);
        });
    });

});

describe('StandardBaseConverter fromStringDirect tests', () => {
    const BaseConverter = new StandardBaseConverter();

    it('converts positive base 2 integer to base 10', () => {
        // given
        const input = '11001';
        const inputRadix = 2;
        const expectedValue = new BigNumber(25);
        const expectedComplement = '(0)11001';

        // when
        const result = BaseConverter.fromStringDirect(input, inputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts negative base 2 integer to base 10', () => {
        // given
        const input = '-11001';
        const inputRadix = 2;
        const expectedValue = new BigNumber(-25);
        const expectedComplement = '(1)00111';

        // when
        const result = BaseConverter.fromStringDirect(input, inputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive floating base 2 to base 10', () => {
        // given
        const input = '11001.1';
        const inputRadix = 2;
        const expectedValue = new BigNumber(25.5);
        const expectedComplement = '(0)11001.1';

        // when
        const result = BaseConverter.fromStringDirect(input, inputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts negative floating base 2 to base 10', () => {
        // given
        const input = '-11001.1';
        const inputRadix = 2;
        const expectedValue = new BigNumber(-25.5);
        const expectedComplement = '(1)00110.1';

        // when
        const result = BaseConverter.fromStringDirect(input, inputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive floating base 16 to base 10', () => {
        // given
        const input = 'FF.8';
        const inputRadix = 16;
        const expectedValue = new BigNumber(255.5);
        const expectedComplement = '(0)FF.8';

        // when
        const result = BaseConverter.fromStringDirect(input, inputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts negative floating base 16 to base 10', () => {
        // given
        const input = '-FF.8';
        const inputRadix = 16;
        const expectedValue = new BigNumber(-255.5);
        const expectedComplement = '(F)00.8';

        // when
        const result = BaseConverter.fromStringDirect(input, inputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive floating base 2 to base 8', () => {
        // given
        const input = '11001.1';
        const inputRadix = 2;
        const expectedValue = new BigNumber(25.5);
        const expectedComplement = '(0)11001.1';

        // when
        const conv = BaseConverter.fromStringDirect(input, inputRadix);
        const result = conv.result;

        // then
        expect(result.valueInBase).toEqual(input);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('throws error if repStr does match input radix', () => {
        // given
        const input = '-FF8.923';
        const inputRadix = 10;
        const outputRadix = 16;

        // then
        expect(() => {
            BaseConverter.fromStringDirect(input, inputRadix);
        }).toThrow();
    });

});

describe('StandardBaseConverter fromDigitsDirect tests', () => {
    const BaseConverter = new StandardBaseConverter();

    it('converts positive base 2 integer to base 10', () => {
        // given
        const digits: Digit[] = [
            { base: 2, position: 4, valueInBase: '1', valueInDecimal: 1 },
            { base: 2, position: 3, valueInBase: '1', valueInDecimal: 1 },
            { base: 2, position: 2, valueInBase: '0', valueInDecimal: 0 },
            { base: 2, position: 1, valueInBase: '0', valueInDecimal: 0 },
            { base: 2, position: 0, valueInBase: '1', valueInDecimal: 1 },
        ];
        const expectedValueInBase = '11001';
        const expectedValue = new BigNumber(25);
        const expectedComplement = '(0)11001';

        // when
        const result = BaseConverter.fromDigitsDirect(digits).result;

        // then
        expect(result.valueInBase).toEqual(expectedValueInBase);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts positive base 2 integer with fractional part to base 10', () => {
        // given
        const digits: Digit[] = [
            { base: 2, position: 4, valueInBase: '1', valueInDecimal: 1 },
            { base: 2, position: 3, valueInBase: '1', valueInDecimal: 1 },
            { base: 2, position: 2, valueInBase: '0', valueInDecimal: 0 },
            { base: 2, position: 1, valueInBase: '0', valueInDecimal: 0 },
            { base: 2, position: 0, valueInBase: '1', valueInDecimal: 1 },
            { base: 2, position: -1, valueInBase: '1', valueInDecimal: 1 },
        ];
        const expectedValueInBase = '11001.1';
        const expectedValue = new BigNumber(25.5);
        const expectedComplement = '(0)11001.1';

        // when
        const result = BaseConverter.fromDigitsDirect(digits)
            .result;

        // then
        expect(result.valueInBase).toEqual(expectedValueInBase);
        expect(result.decimalValue).toEqual(expectedValue);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

});

describe('fromNumber tests', () => {
    it('converts number with variable precision', () => {
        // given
        const input = new BigNumber(25.5);
        const radix = 2;
        const expected = '11001.1';
        const expectedComplement = '(0)11001.1';

        // when
        const result = fromNumber(input, radix).result;

        // then
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

    it('converts number using StandardBaseConverter', () => {
        // given
        const input = new BigNumber(25.5);
        const radix = 2;
        const expected = '11001.1';
        const expectedComplement = '(0)11001.1';

        // when
        const result = fromNumber(input, radix).result;

        // then
        expect(result.valueInBase).toEqual(expected);
        expect(result.complement.toString()).toEqual(expectedComplement);
    });

});

describe('fromString tests', () => {
    it('should convert string with extra whitespace', () => {
        // given
        const input = '12  13  45  ';
        const inputRadix = 64;
        const outputRadix = 10;
        const expected = new BigNumber(50029);

        // when
        const result = fromString(input, inputRadix, outputRadix)
            .result;

        // then
        expect(result.valueInBase).toEqual(expected.toString());
    });

});
