import { alignFractions, shiftLeft } from '../digits';
import { fromDigits } from '../base-converter';
import { getComplement } from '../complement-converter';
import { addDigitsArrays } from '../addition';
import { PositionalNumber } from '../positional-number';
import { Digit, MultiplicationOperand, MultiplicationResult, MultiplicationRowResult } from '../../models';
import { OperationType } from '../../models/operation';
import { MultiplicationType } from '../../models/operation-algorithm';
import { adjustForMultiplierFraction } from './common';
import { BaseDigits } from '../base-digits';
import { NumberComplement } from '../number-complement';
import { multiplyRowByDigit, shiftAndExtend, trimSumDigits } from './multiplication-with-extension';

export function multiplyWithoutExtension(numbers: PositionalNumber[]): MultiplicationResult {
    const [multiplicand, multiplier] = numbers;
    const [alMultiplicand, alMultiplier] = alignFractions(
        [
            multiplicand.complement.asDigits(),
            multiplier.complement.asDigits()
        ]
    );
    const resultNegative = multiplicand.isNegative() !== multiplier.isNegative();
    const multiplierNegative = multiplier.isNegative();
    const result = multiplyDigitRows(
        alMultiplicand,
        alMultiplier.filter(d => !d.isComplementExtension),
        multiplicand.complement.asDigits(),
        resultNegative,
        multiplierNegative
    );

    return {
        ...result,
        numberOperands: numbers
    };
}

function multiplyDigitRows(
    multiplicandRow: MultiplicationOperand[],
    multiplierRow: MultiplicationOperand[],
    multiplicandDigits: Digit[],
    resultNegative: boolean,
    multiplierNegative: boolean
): MultiplicationResult {
    const positionsAscending = [...multiplierRow].reverse();
    const lastMultiplier = multiplierNegative ?
        positionsAscending.pop()
        : null;

    const rowResults: MultiplicationRowResult[] = positionsAscending.map((multiplier) => {
        return multiplyRowByDigit(multiplicandRow, multiplier);
    });

    const digitsToShift = rowResults.map(r => r.resultDigits);

    let multiplicandComplement: PositionalNumber;
    let lastMultiplierDigit: MultiplicationOperand;

    if (multiplierNegative) {
        const actualMultiplierValue = -(lastMultiplier.base - lastMultiplier.valueInDecimal);

        const absDigit = BaseDigits.getDigit(
            Math.abs(actualMultiplierValue),
            lastMultiplier.base,
            lastMultiplier.position
        );

        const complement = getComplement(new NumberComplement(multiplicandDigits));
        const lastDigits = multiplyRowByDigit(complement.asDigits(), absDigit).resultDigits;

        digitsToShift.push(lastDigits);

        multiplicandComplement = fromDigits(complement.asDigits()).result;
        lastMultiplierDigit = lastMultiplier;
    } else {
        lastMultiplierDigit = positionsAscending[0];
    }

    const shifted = shiftAndExtend(digitsToShift);

    const sum = addDigitsArrays(shifted);
    const adjustedSum = adjustForMultiplierFraction(sum, multiplierRow);
    const trimmedLeadingZeros = trimSumDigits(adjustedSum.numberResult.asDigits());
    const resultWithProperSign = fromDigits(trimmedLeadingZeros, resultNegative).result;

    return {
        operands: [multiplicandRow, multiplierRow],
        resultDigits: adjustedSum.resultDigits,
        numberResult: resultWithProperSign,
        numberOperands: [],
        addition: adjustedSum,
        stepResults: rowResults,
        operation: OperationType.Multiplication,
        algorithmType: MultiplicationType.WithoutExtension,
        multiplicandComplement,
        lastMultiplierDigit
    };
}