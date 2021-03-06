import { fromDigits } from '../base-converter';
import { getComplement } from '../complement-converter';
import { addDigitsArrays } from '../addition';
import { PositionalNumber } from '../positional-number';
import { MultiplicationOperand, MultiplicationResult, MultiplicationRowResult } from '../../models';
import { OperationType } from '../../models/operation';
import { MultiplicationType } from '../../models/operation-algorithm';
import { BaseDigits } from '../base-digits';
import { NumberComplement } from '../number-complement';
import { WithExtension } from './with-extension';
import { OperandsTransformType } from '../transform/preprocessor-type';
import { applyTransformsByType } from '../transform/apply-by-type';

export class WithoutExtension extends WithExtension {
    prepareOperands(): MultiplicationOperand[][] {
        const transforms = [
            OperandsTransformType.AlignFractions,
            OperandsTransformType.FilterMultiplierExtension
        ];

        return applyTransformsByType(
            [
                this.multiplicand.complement.asDigits(),
                this.multiplier.complement.asDigits()
            ],
            transforms
        );
    }

    multiplyDigitRows(multiplicandRow: MultiplicationOperand[], multiplierRow: MultiplicationOperand[]): MultiplicationResult {
        const positionsAscending = [...multiplierRow].reverse();
        const lastMultiplier = this.multiplier.isNegative() ?
            positionsAscending.pop()
            : null;

        const rowResults: MultiplicationRowResult[] = positionsAscending.map((multiplier) => {
            return this.multiplyRowByDigit(multiplicandRow, multiplier);
        });

        const digitsToAdd = rowResults.map(r => r.resultDigits);

        let multiplicandComplement: PositionalNumber;
        let lastMultiplierDigit: MultiplicationOperand;

        if (this.multiplier.isNegative()) {
            const actualMultiplierValue = -(lastMultiplier.base - lastMultiplier.valueInDecimal);

            const absDigit = BaseDigits.getDigit(
                Math.abs(actualMultiplierValue),
                lastMultiplier.base,
                lastMultiplier.position
            );

            const complement = getComplement(new NumberComplement(multiplicandRow));
            const lastDigits = this.multiplyRowByDigit(complement.asDigits(), absDigit).resultDigits;

            digitsToAdd.push(lastDigits);

            multiplicandComplement = fromDigits(complement.asDigits()).result;
            lastMultiplierDigit = lastMultiplier;
        } else {
            lastMultiplierDigit = positionsAscending[0];
        }

        const shifted = this.transformForAddition(digitsToAdd);
        const sum = addDigitsArrays(shifted);
        const adjustedSum = this.adjustForMultiplierFraction(sum, multiplierRow);
        const trimmedLeadingZeros = this.trimSumDigits(adjustedSum.numberResult.asDigits());
        const resultWithProperSign = fromDigits(trimmedLeadingZeros, this.resultNegative).result;

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
}

