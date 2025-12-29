import { ITransaction } from "./ITransactions.interface";

export interface ITransactionDocument extends ITransaction {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}