import { Document } from "mongoose";
import { ICategory } from "./ICategories.interface";

export interface CategoryDocument extends ICategory, Document { }
