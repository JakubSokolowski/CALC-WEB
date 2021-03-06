import React, { FC } from 'react';
import { PositionalNumber } from '@calc/calc-arithmetic';
import { makeStyles } from '@material-ui/core/styles';
import { createStyles, Theme } from '@material-ui/core';
import { DisplayBase, PositionalNumberComponent } from '@calc/positional-ui';
import { InlineMath } from '@calc/common-ui';

interface P {
    operands: PositionalNumber[];
    result: PositionalNumber;
    joinSymbol: string;
    tooltipBases?: DisplayBase[];
    showAsComplement?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: theme.spacing(0.5)
        },
        operand: {
            padding: '2px'
        },
        symbol: {
            padding: '2px'
        }
    })
);

export const OperandRow: FC<P> = ({ operands, joinSymbol, tooltipBases, result, showAsComplement }) => {
    const classes = useStyles();
    const operandsWithSymbols = [];

    operands.forEach((op, index) => {
        const num = (
            <PositionalNumberComponent
                input={op}
                className={classes.operand}
                key={index}
                additionalBases={tooltipBases}
            />
        );

        if(index > 0) {
            const symbol = (
                <div className={classes.symbol} key={`${index}-symbol`}>
                    <InlineMath math={joinSymbol}/>
                </div>
            );
            operandsWithSymbols.push(symbol);
        }

        operandsWithSymbols.push(num);
    });

    const res = (
        <PositionalNumberComponent
            className={classes.operand}
            input={result}
        />
    );

    const equalSign = (
        <div className={classes.symbol}>
            <InlineMath math={'='}/>
        </div>
    );

    return (
        <div className={classes.row}>
            {operandsWithSymbols}
            {equalSign}
            {res}
            {
                showAsComplement && <span style={{display: 'inline-flex'}} className="non-complement-result">
                    {equalSign}
                    <PositionalNumberComponent
                        input={result}
                        className={classes.operand}
                        additionalBases={tooltipBases}
                    />
                </span>
            }
        </div>
    );
};
