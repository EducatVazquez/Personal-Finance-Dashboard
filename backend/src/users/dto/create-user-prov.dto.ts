import { IsOptional, IsString } from "class-validator";
import { IUser } from "../interfaces/users.interface";

export class CreateUserProvDto implements Omit<IUser, "google_id" | "photo_url" | "transactions" | "balance"> {
    @IsString()
    name: string;
    @IsString()
    email: string;
    @IsString()
    google_id: string;
    @IsString()
    @IsOptional()
    photo_url?: string;
}