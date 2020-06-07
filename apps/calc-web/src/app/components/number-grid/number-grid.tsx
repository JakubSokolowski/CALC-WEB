import React, { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { NumberGridRow, RowClickEvent } from './number-grid-row/number-grid-row';
import { gridToAscii, OperationGrid } from '../../core/operation-grid';
import './number-grid.scss';
import { CellClickEvent } from './number-grid-cell/number-grid-cell';
import { Button, message, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons/lib';
import { copyToClipboard } from '../float-converter/input-with-copy/input-with-copy';
import { TooltipPlacement } from 'antd/es/tooltip';

export interface ColumnClickEvent {
    columnValue: any[];
    columnIndex: number;
}

interface P {
    grid: OperationGrid<any>;
    title?: string;
    hooverComponents?: any[];
    onCellClick?: (event: CellClickEvent) => void;
    onRowClick?: (event: RowClickEvent) => void;
    onColumnClick?: (event: ColumnClickEvent) => void;
    cellHooverBuilder?: (value: any) => ReactNode;
    rowHooverBuilder?: (rowValues: any[], hooverProps: any) => ReactNode;
}

export const NumberGrid: FC<P> = (
    {
        grid,
        onRowClick,
        onCellClick,
        onColumnClick,
        hooverComponents,
        rowHooverBuilder,
        title
    }) => {
    const targetRef = useRef<HTMLDivElement>();
    const [tooltipPlacement, setTooltipPlacement] = useState<TooltipPlacement>('top');

    useLayoutEffect(() => {
        if (targetRef && targetRef.current) {
            // this does not seem to work on row changes
            const hasOverflowingHeight = targetRef.current.offsetWidth < targetRef.current.scrollWidth;
            const newTooltipPlacement = hasOverflowingHeight ? 'top' : 'right';
            // setTooltipPlacement(newTooltipPlacement);
        }
    }, []);


    const handleCellClick = (event: CellClickEvent) => {
        if (onCellClick) {
            onCellClick(event);
        }

        if(onRowClick) {
            const rowClickEvent: RowClickEvent = {
                rowIndex: event.y,
                rowValue: grid.cellDisplayValues[event.y]
            };

            onRowClick(rowClickEvent)
        }

        if(onColumnClick) {
            const columnClickEvent: ColumnClickEvent = {
                columnIndex: event.x,
                columnValue: grid.cellDisplayValues.map((row) => row[event.x])
            };

            onColumnClick(columnClickEvent)
        }
    };

    const handleCopy = () => {
        const ascii = gridToAscii(grid);
        copyToClipboard(ascii);
        message.info('Copied ascii to clipboard');
    };

    const rows = grid.cellDisplayValues.map((row, index) => {
        return (
            <NumberGridRow
                values={row}
                key={index}
                tooltipPlacement={tooltipPlacement}
                horizontalLine={grid.horizontalLine && grid.horizontalLine === index}
                verticalLineIndex={grid.verticalLine}
                rowHooverProps={grid.rowHooverContentProps && grid.rowHooverContentProps[index]}
                rowIndex={index}
                onCellClick={handleCellClick}
                rowHooverBuilder={rowHooverBuilder}
            />
        );
    });

    return (
        <div style={{ paddingTop: '12px', width: '100%', flexGrow: 1, maxWidth: '45vw'}}>
            {
                title &&
                <div style={{paddingBottom: '12px', display: 'flex', flexDirection: 'row'}}>
                    <Typography>{title}</Typography>
                    <Button style={{marginRight: '2px', marginLeft: '10px'}} size={'small'} onClick={handleCopy}>
                        <CopyOutlined/>
                    </Button>
                </div>
            }
            <div ref={targetRef} style={{border: '1px solid  #d9d9d9', overflowY: 'auto', overflowX: 'auto', maxHeight: '500px'}}>
                {rows}
            </div>
        </div>
    );
};
