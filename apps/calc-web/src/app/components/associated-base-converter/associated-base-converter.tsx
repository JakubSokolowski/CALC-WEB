import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import {
    BaseDigits,
    ComplementConverter,
    Conversion,
    convertUsingAssociatedBases,
    fromString,
    isValidString
} from '@calc/calc-arithmetic';
import './associated-base-converter.scss';
import { useForm } from 'antd/es/form/util';
import { InputWithCopy } from '@calc/ui';
import { useSelector } from 'react-redux';
import { selectShowComplement, selectShowDecimalValue } from '../../store/selectors/options.selectors';
import { ConversionOptions } from '../conversion-options/conversion-options';
const { Option } = Select;

interface P {
    onConversionChange?: (conversion: Conversion) => void;
}

interface FormValues {
    inputStr: string;
    inputBase: number;
    outputBase: number;
}

export const AssociatedBaseConverter: FC<P> = ({ onConversionChange }) => {
    const [form] = useForm();
    const showComplement = useSelector(selectShowComplement);
    const showDecimalValue = useSelector(selectShowDecimalValue);

    const initialValues: FormValues = {
        inputStr: 'FFAFAFFAF',
        inputBase: 16,
        outputBase: 2
    };

    const [inputValue, setInputValue] = useState(initialValues.inputStr);
    const [inputBase, setInputBase] = useState(initialValues.inputBase);

    const [possibleOutputBases, setPossibleOutputBases] = useState<number[]>(() => {
        return BaseDigits.getAllPossibleBasesForAssociateConversion(initialValues.inputBase);
    });

    const onFinish = (values: FormValues) => {
        const { inputStr, inputBase, outputBase } = values;
        const conversion = convertUsingAssociatedBases(inputStr, inputBase, outputBase);
        onConversionChange(conversion);
    };

    const checkBase = (_, base: number) => {
        if (!BaseDigits.isValidRadix(base)) {
            return Promise.reject(`Base must be between ${BaseDigits.MIN_BASE} and ${BaseDigits.MAX_BASE}`);
        }
        return Promise.resolve();
    };

    const getDecimal = useCallback(() => {
        try {
            if(inputBase === 10) return inputValue;
            return fromString(
                inputValue,
                inputBase,
                10
            ).result.decimalValue.toString()
        } catch(e) {
            console.log(e);
            return '0.0'
        }
    }, [inputBase, inputValue]);

    const getComplement = useCallback(() => {
        try {
            return ComplementConverter.getComplement(
                inputValue,
                inputBase,
            ).toString()
        } catch(e) {
            console.log(e);
            return '0.0'
        }
    }, [inputBase, inputValue]);

    const checkValueStr = (_, valueStr: string) => {
        const { inputBase } = form.getFieldsValue();
        if (!isValidString(valueStr, inputBase)) {
            return Promise.reject(`Representation strings contains invalid digits for base ${inputBase}`);
        }
        return Promise.resolve();
    };

    const onInputBaseChange = (e) => {
        const newInputBase = e.target.value;
        setInputBase(e.target.value);
        setPossibleOutputBases(BaseDigits.getAllPossibleBasesForAssociateConversion(newInputBase));
        form.validateFields()
    };

    useEffect(() => {
        form.setFieldsValue({outputBase: possibleOutputBases[0]});
    }, [form, possibleOutputBases]);

    const label = (
        <div style={{display: 'flex', 'flexDirection': 'row'}}>
            <span>{'Input number'}</span>
            <ConversionOptions style={{marginLeft: '100px'}}/>
        </div>
    );

    const options = possibleOutputBases.map((base, index) => {
        return (
            <Option value={base} key={index}>{base}</Option>
        )
    });

    return (
        <div>
            <Form layout={'vertical'} initialValues={initialValues} form={form} onFinish={onFinish}>
                <Form.Item
                    name={'inputStr'}
                    label={label}
                    rules={[{ validator: checkValueStr }]}
                >
                    <InputWithCopy
                        onChange={(value) => {
                            setInputValue(value);
                            form.validateFields()
                        }}
                    />
                </Form.Item>
                {
                    showDecimalValue &&
                    <Form.Item
                        label={'Input decimal value'}
                    >
                        <InputWithCopy readOnly value={getDecimal()}/>
                    </Form.Item>
                }

                {
                    showComplement &&
                    <Form.Item
                        label={'Input complement'}
                    >
                        <InputWithCopy readOnly value={getComplement()}/>
                    </Form.Item>
                }
                <Form.Item className="action-row">
                    <Input.Group style={{ display: 'flex', flexDirection: 'row' }}>
                        <Form.Item
                            name={'inputBase'}
                            label={'Input Base'}
                            style={{ width: '40%' }}
                            rules={[{ validator: checkBase }]}
                        >
                            <Input
                                type="number"
                                onChange={onInputBaseChange}
                            />
                        </Form.Item>
                        <div style={{ width: '20px' }}/>
                        <Form.Item
                            name={'outputBase'}
                            label={'Output Base'}
                            style={{ width: '40%' }}
                        >
                            <Select
                                placeholder="No output bases possible"
                                disabled={!options.length}
                                style={{width: '100%'}}
                            >
                                {options}
                            </Select>
                        </Form.Item>
                        <div style={{ width: '20px' }}/>
                        <div className="button-wrapper convert-button-wrapper">
                            <Button className="inline-form-button" type="primary" htmlType="submit"> Convert </Button>
                        </div>
                    </Input.Group>
                </Form.Item>
            </Form>
        </div>
    );
};
