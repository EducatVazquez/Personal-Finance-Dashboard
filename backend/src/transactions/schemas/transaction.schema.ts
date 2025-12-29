import * as mongoose from 'mongoose';
import { ITransactionDocument } from '@/transactions/interfaces/ITransactionDocument.interface';
import { TransactionType } from '../interfaces/ITransactions.interface';

export const TransactionSchema = new mongoose.Schema<ITransactionDocument>({
    userId: { type: String, required: true },
    category_id: { type: String },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true, uppercase: true },
    date: { type: Date, required: true },
    description: { type: String }
},
    {
        timestamps: true
    }
);
