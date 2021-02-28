import { OperationTemplate } from '@calc/positional-calculator';
import { AlgorithmType, MultiplicationType, OperationType } from '@calc/calc-arithmetic';
import {
    getCellByCoords,
    getMultiplicationResult,
    getOperationGrid, gridHasProperResultRow,
    operationReturnsProperResult
} from '../../support/positional-calculator';

describe('Default multiplication', () => {
    beforeEach(() => {
        cy.fixCypressSpec(__filename);
        cy.clearLocalStorage();
        cy.visit('#/tools/positional/positional-calculator');
    });

    it('should multiply two positive numbers', () => {
        const base = 10;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['78', '88'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.Default,
            base
        };
        const expected = '6864';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display proper popover for addition rows
        getCellByCoords(5, 4).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=4');

        getCellByCoords(2, 4).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{3}=6');

        gridHasProperResultRow(expected, base, 5, 4);
    });

    it('should multiply two negative numbers', () => {
        const base = 10;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['-78', '-88'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.Default,
            base
        };
        const expected = '6864';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        gridHasProperResultRow(expected, base, 5, 4);
    });

    it('should multiply negative and positive numbers', () => {
        const base = 10;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['-78', '-88'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.Default,
            base
        };
        const expected = '6864';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        gridHasProperResultRow(expected, base, 5, 4);
    });

    it('should multiply two U2 numbers', () => {
        const base = 2;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(1)01011', '(1)000110'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.Default,
            base
        };
        const expected = '10011000010';
        const expectedComplement = '(0)10011000010';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display proper popover for addition rows
        getCellByCoords(12, 8).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=0');

        getCellByCoords(2, 8).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{10}=1');

        gridHasProperResultRow(expectedComplement, base, 12, 8);
    });
});

describe('Multiplication with extension', () => {
    beforeEach(() => {
        cy.fixCypressSpec(__filename);
        cy.clearLocalStorage();
        cy.visit('#/tools/positional/positional-calculator');
    });

    it('should multiply two numbers', () => {
        const base = 10;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['78', '-88'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base
        };
        const expected = '-6864';
        const expectedComplement = '(9)3136';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        gridHasProperResultRow(expectedComplement, base, 5, 6);
    });

    // BUG #119
    it('should multiply number by 0', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['123', '0'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base: 10
        };
        const expected = '0';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();
    });

    it('should multiply 0 by number', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['0', '9'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base: 10
        };
        const expected = '0';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();
    });

    it('should multiply two numbers in base 8', () => {
        const base = 8;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['-33', '723'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base
        };
        const expected = '-30501';
        const expectedComplement = '(7)47277';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        gridHasProperResultRow(expectedComplement, base, 6, 5);
    });

    it('should multiply numbers entered as complements in base 8', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(0)3156', '(7)6423'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base: 8
        };
        const expected = '-4547726';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();
    });

    // BUG #125
    it('should not display any empty columns and should display popover with position result on cell hover', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['12', '8'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base: 10
        };
        const expected = '96';

        operationReturnsProperResult(config, expected);

        // desired grid has width of 4 so this cell should not exist
        getCellByCoords(4, 0).should('not.exist');

        // should display popover with proper content
        getCellByCoords(3, 3).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=6');
    });


    it('should show proper information on last multiplier digit tooltip when multiplier is negative', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['12', '-8'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base: 10
        };
        const expected = '-96';

        operationReturnsProperResult(config, expected);

        // should display popover with proper content
        getCellByCoords(3, 2).trigger('mouseover')
            .getByDataTest('correction-with-extension-negative')
    });

    it('should show proper information on last multiplier digit tooltip when multiplier is positive', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['12', '8'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base: 10
        };
        const expected = '96';

        operationReturnsProperResult(config, expected);

        // should display popover with proper content
        getCellByCoords(2, 1).trigger('mouseover')
            .getByDataTest('correction-with-extension-positive')
    });

    it('should multiply two U2 numbers', () => {
        const base = 2;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(1)01011', '(1)000110'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithExtension,
            base
        };
        const expected = '10011000010';
        const expectedComplement = '(0)10011000010';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display proper popover for addition rows
        getCellByCoords(12, 10).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=0');

        getCellByCoords(2, 10).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{10}=1');

        gridHasProperResultRow(expectedComplement, base, 12, 10);
    });
});

describe('Multiplication without extension', () => {
    beforeEach(() => {
        cy.fixCypressSpec(__filename);
        cy.clearLocalStorage();
        cy.visit('#/tools/positional/positional-calculator');
    });

    it('should multiply two negative numbers', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(9)6745', '(9)8123'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 10
        };
        const expected = '6109635';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display popover with proper content
        getCellByCoords(8, 7).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=5');
    });

    it('should multiply number by 0', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['123', '0'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 10
        };
        const expected = '0';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();
    });

    it('should multiply 0 by number', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['0', '9'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 10
        };
        const expected = '0';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();
    });

    it('should multiply positive number by negative', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(0)3156', '(7)6423'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 8
        };
        const expected = '-4547726';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display popover with proper content
        getCellByCoords(8, 7).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=2');
    });

    it('should multiply negative number by positive', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(7)45', '(0)723'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 8
        };
        const expected = '-30501';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display popover with proper content
        getCellByCoords(6, 5).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=7');
    });

    it('should multiply numbers with fraction part', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(0)31.12', '(7)64'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 8
        };
        const expected = '-455.7';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();
    });

    it('should show proper information on last multiplier digit tooltip when multiplier is positive', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['12', '8'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 10
        };
        const expected = '96';

        operationReturnsProperResult(config, expected);

        // should display popover with proper content
        getCellByCoords(3, 1).trigger('mouseover')
            .getByDataTest('correction-without-extension-positive')
    });

    it('should show proper information on last multiplier digit tooltip when multiplier is negative', () => {
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['12', '-89'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base: 10
        };
        const expected = '-1068';

        operationReturnsProperResult(config, expected);

        // should display popover with proper content
        getCellByCoords(4, 2).trigger('mouseover')
            .getByDataTest('correction-without-extension-negative')
    });

    it('should multiply two U2 numbers with negative multiplier', () => {
        const base = 2;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(1)01011', '(1)000110'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base
        };
        const expected = '10011000010';
        const expectedComplement = '(0)10011000010';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display proper popover for addition rows
        getCellByCoords(14, 11).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=0');

        getCellByCoords(4, 11).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{10}=1');

        gridHasProperResultRow(expectedComplement, base, 14, 11);

        // should display popover with proper content for last multiplier
        getCellByCoords(8, 2).trigger('mouseover')
            .getByDataTest('last-multiplier-without-extension-u2-negative');

        // should display popover with proper content for multiplication by 0 row
        getCellByCoords(8, 3).trigger('mouseover')
            .getByDataTest('without-extension-u2-row-by-0');

        // should display popover with proper content for multiplication by 1 row
        getCellByCoords(8, 4).trigger('mouseover')
            .getByDataTest('without-extension-u2-row-by-1');

        // should display popover with proper content for correction row
        getCellByCoords(4, 10).trigger('mouseover')
            .getByDataTest('without-extension-u2-correction');
    });

    it('should multiply two U2 numbers with positive multiplier', () => {
        const base = 2;
        const config: OperationTemplate<AlgorithmType> = {
            operands: ['(1)01011', '(0)000110'],
            operation: OperationType.Multiplication,
            algorithm: MultiplicationType.WithoutExtension,
            base
        };
        const expected = '-1111110';
        const expectedComplement = '(1)0000010';

        operationReturnsProperResult(config, expected);

        getMultiplicationResult().toMatchSnapshot();
        getOperationGrid().toMatchSnapshot();

        // should display proper popover for addition rows
        getCellByCoords(12, 9).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{0}=0');

        getCellByCoords(5, 9).trigger('mouseover')
            .getByDataTest('add-at-position')
            .contains('S_{7}=1');

         gridHasProperResultRow(expectedComplement, base, 12, 9);

        // should display popover with proper content for last multiplier
        getCellByCoords(7, 1).trigger('mouseover')
            .getByDataTest('last-multiplier-without-extension-u2-positive');

        // should display popover with proper content for multiplication by 0 row
        getCellByCoords(7, 2).trigger('mouseover')
            .getByDataTest('without-extension-u2-row-by-0');

        // should display popover with proper content for multiplication by 1 row
        getCellByCoords(7, 3).trigger('mouseover')
            .getByDataTest('without-extension-u2-row-by-1');


        // should display popover with proper content for correction row
        getCellByCoords(7, 8).trigger('mouseover')
            .getByDataTest('without-extension-u2-correction');
    });
});
