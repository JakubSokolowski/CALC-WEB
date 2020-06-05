import React, { FC } from 'react';
import './number-grid-cell.scss';
import { CellConfig } from '../../../core/operation-grid';

export interface CellClickEvent {
    value: CellConfig;
    x: number;
    y: number;
}

interface P {
    value: CellConfig;
    horizontalLine?: boolean;
    verticalLine?: boolean;
    x: number;
    y: number;
    highlightRow?: boolean;
    onClick?: (event: CellClickEvent) => void;
}

export const NumberGridCell: FC<P> = (
    {
        x,
        y,
        value,
        horizontalLine,
        verticalLine,
        highlightRow,
        onClick
    }) => {

    const defaultBorder = '1px #e3e3e3 dashed';

    const handleClick = () => {
        if (onClick) {
            const cellEvent: CellClickEvent = {
                value,
                x,
                y
            };
            onClick(cellEvent);
        }
    };

    const borders = {
        borderBottom: horizontalLine ? '1px #333333 solid' : defaultBorder,
        borderRight: verticalLine ? '1px #333333 solid' : defaultBorder
    };

    const getHighlightStyle = () => {
        if(highlightRow) {
            if(value.highlight) {
                return {color: 'rgba(0, 0, 0, 0.65)', background: '#fff', border: 'none'}
            }
            if(verticalLine) {
                return {background: 'rgba(0, 0, 0, 0.65)', color: '#fff', borderRight: '1px #fff solid'}
            }
            return {background: 'rgba(0, 0, 0, 0.65)', color: '#fff', border: 'none'};
        }
        return {background:  value.highlight ? '#e3e3e3' : '', ...borders}
    };

    const style =  {
        ...getHighlightStyle()
    };

    return (
        <div className={value.delimiterAfter ? 'number-grid-cell delimiter-cell' : 'number-grid-cell'} onClick={handleClick} style={style} >
            {value?.value}
        </div>
    );
};
