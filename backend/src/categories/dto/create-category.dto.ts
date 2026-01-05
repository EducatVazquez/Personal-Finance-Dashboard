import { IsOptional, IsString } from "class-validator";
import { ICategory } from "../interfaces/ICategories.interface";

export class CreateCategoryDto implements ICategory {
    @IsString()
    name: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsString()
    @IsOptional()
    userId?: string;
}
