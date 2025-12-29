import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ITransaction, TransactionType } from "@/transactions/interfaces/ITransactions.interface";
import { Type } from "class-transformer";

export class CreateTransactionDto implements Omit<ITransaction, "userId"> {
    @IsString()
    category_id: string;
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