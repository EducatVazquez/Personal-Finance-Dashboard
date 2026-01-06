import * as mongoose from 'mongoose';
import { ITransactionDocument } from '@/transactions/interfaces/ITransactionDocument.interface';
import { TransactionType } from '../interfaces/ITransactions.interface';

export const TransactionSchema = new mongoose.Schema<ITransactionDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(TransactionType), required: true, uppercase: true },
    date: { type: Date, required: true },
    description: { type: String }
},
    {
        timestamps: true
    }
);
