import { IsString } from "class-validator";
import { IUser } from "../interfaces/users.interface";

export class CreateUserDto implements Omit<IUser, "google_id" | "photo_url" | "transactions" | "balance"> {
    @IsString()
    name: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
}