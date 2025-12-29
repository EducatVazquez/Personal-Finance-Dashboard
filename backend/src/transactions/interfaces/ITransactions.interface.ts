export interface ITransaction {
    userId: string;
    category_id?: string;
    amount: number;
    date: Date;
    type: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum TransactionType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}