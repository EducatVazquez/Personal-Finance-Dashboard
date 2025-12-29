import * as mongoose from 'mongoose';
import { UserDocument } from '@/users/interfaces/users.interface';

export const UserSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true },
    google_id: { type: String, unique: true }, // Added unique for security
    email: { type: String, required: true, unique: true },    // Added unique
    photo_url: { type: String },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    password: { type: String, required: true }
}, {
    timestamps: true
});
