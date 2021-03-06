import { mount } from 'enzyme';
import React from 'react';
import { addPositionalNumbers, fromNumber } from '@calc/calc-arithmetic';
import { PositionalNumberComponent } from './positional-number-component';
import { Tooltip } from '@material-ui/core';

describe('PositionalNumberComponent', () => {
    let container;

    const a = fromNumber(10, 10).result;
    const b = fromNumber(5, 10).result;
    const {numberResult} = addPositionalNumbers([a, b]);

    beforeEach(() => {
        container = mount(
            <PositionalNumberComponent
                input={numberResult}
            />
        );
    });

    it('should render', () => {
        expect(container).toBeTruthy();
    });

    it('should render tooltip when showAdditionalInfo is not specified', () => {
       // when
        container = mount(
            <PositionalNumberComponent
                input={numberResult}
            />
        );

        // then
        const tooltip = container.find(Tooltip);
        expect(tooltip.length).toEqual(1);
    });

    it('should not render tooltip when showAdditionalInfo is false', () => {
        // when
        container = mount(
            <PositionalNumberComponent
                input={numberResult}
                showAdditionalInfo={false}
            />
        );

        // then
        const tooltip = container.find(Tooltip);
        expect(tooltip.length).toEqual(0);
    });
});
