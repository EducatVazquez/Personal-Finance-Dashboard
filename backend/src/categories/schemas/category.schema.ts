import * as mongoose from 'mongoose';
import { CategoryDocument } from '../interfaces/ICategoriesDocument.interface';

export const CategorySchema = new mongoose.Schema<CategoryDocument>({
    name: { type: String, required: true },
    description: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});
