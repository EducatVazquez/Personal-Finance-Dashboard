import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { ITransaction, TransactionType } from "@/transactions/interfaces/ITransactions.interface";
import { Type } from "class-transformer";

export class CreateTransactionDto implements Omit<ITransaction, "userId"> {
    @ValidateIf(o => !o.newCategoryName) // Validate this ONLY if newCategoryName is empty
    @IsNotEmpty({ message: 'Either category_id or newCategoryName must be provided' })
    @IsString()
    category_id: string;
    @ValidateIf(o => !o.category_id) // Validate this ONLY if category_id is empty
    @IsNotEmpty({ message: 'newCategoryName is required when category_id is missing' })
    @IsString()
    newCategoryName: string;
    @IsNumber()
    amount: number;
    @IsDate()
    @Type(() => Date)
    date: Date;
    @IsString()
    @IsOptional()
    description: string;
    @IsString()
    @IsEnum(TransactionType)
    type: string;
}