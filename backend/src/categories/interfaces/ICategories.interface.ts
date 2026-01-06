import { Types } from "mongoose";
import { UserDocument } from "@/users/interfaces/users.interface";

export interface ICategory {
    name: string;
    userId?: string | null | Types.ObjectId | UserDocument;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}