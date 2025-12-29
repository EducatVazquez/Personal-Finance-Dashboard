import { Document } from 'mongoose';

export interface IUser {
    name: string;
    google_id: string;
    balance: number;
    email: string;
    photo_url?: string;
    transactions: string[];
    password?: string;
}

// This is what the Model needs
export interface UserDocument extends IUser, Document { }
