import { CategoryDocument } from "@/categories/interfaces/ICategoriesDocument.interface";
import { UserDocument } from "@/users/interfaces/users.interface";
import { Types } from "mongoose";

export interface ITransaction {
    userId: string | Types.ObjectId | UserDocument;
    category_id?: string | Types.ObjectId | CategoryDocument;
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