import { OperationType } from './operation';

export enum AdditionType {
    Default = 'Default'
}

export enum SubtractionType {
    Default = 'Default'
}

export enum MultiplicationType {
    Default = 'Default',
    WithExtension = 'WithExtension',
    WithoutExtension = 'WithoutExtension'
}

export type AlgorithmType = AdditionType | SubtractionType | MultiplicationType

export interface OperationAlgorithm<T extends AlgorithmType = AlgorithmType> {
    type: T;
    tKey: string;
    allowedBases?: number[];
}

export type AlgorithmOperationMap = Record<OperationType, OperationAlgorithm[]>

export const additionAlgorithms: OperationAlgorithm<AdditionType>[] = [
    {
        type: AdditionType.Default,
        tKey: 'operations.addition.default'
    }
];

export const subtractionAlgorithms: OperationAlgorithm<SubtractionType>[] = [
    {
        type: SubtractionType.Default,
        tKey: 'operations.subtraction.default'
    },
];

export const multiplicationAlgorithms: OperationAlgorithm<MultiplicationType>[] = [
    {
        type: MultiplicationType.Default,
        tKey: 'operations.multiplication.default'
    },
    {
        type: MultiplicationType.WithExtension,
        tKey: 'operations.multiplication.withExtension'
    },
    {
        type: MultiplicationType.WithoutExtension,
        tKey: 'operations.multiplication.withoutExtension'
    },
];


export const algorithmMap: AlgorithmOperationMap = {
    [OperationType.Addition]: additionAlgorithms,
    [OperationType.Subtraction]: subtractionAlgorithms,
    [OperationType.Multiplication]: multiplicationAlgorithms,
    [OperationType.Division]: [],
};
