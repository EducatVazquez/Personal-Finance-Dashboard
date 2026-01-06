import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
/* import { OAuth2Client } from 'google-auth-library'; */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserToClient } from '@/users/interfaces/users.interface'; // Import the Document interface
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    // Note: In production, use ConfigService to get this ID
    /* private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); */

    constructor(
        @InjectModel('User') private userModel: Model<UserDocument>, // Correct Type here
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = Number(this.configService.get<number>('SALT_ROUNDS', 10));
        return bcrypt.hash(password, saltRounds);
    }

    async authenticateGoogle(token: string) {
        try {
            const payload = {
                email: 'test@gmail.com',
                name: 'test',
                picture: 'test',
                sub: 'test',
            };
            /* const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            // 1. Check if payload exists
            if (!payload) {
                throw new UnauthorizedException('Google payload is empty');
            } */

            // 2. Destructure fields
            const { email, name, picture, sub: google_id } = payload;

            // 3. Ensure email is present (since it's required for your DB)
            if (!email) {
                throw new UnauthorizedException('Google account must have an email');
            }

            let user = await this.userModel.findOne({ email });

            if (!user) {
                user = await this.userModel.create({
                    email,
                    name,
                    photo_url: picture,
                    google_id,
                });
            }

            const jwtPayload = { sub: user._id, email: user.email };

            return {
                user,
                access_token: this.jwtService.sign(jwtPayload),
            };

        } catch (error) {
            throw new UnauthorizedException('Invalid Google Token');
        }
    }

    async register(createUserDto: CreateUserDto) {
        try {
            const { password, ...rest } = createUserDto;
            const hashedPassword = await this.hashPassword(password);
            const user = await this.userModel.create({ ...rest, password: hashedPassword });
            const jwtPayload = { sub: user._id, email: user.email };
            return {
                user: user as UserToClient,
                access_token: this.jwtService.sign(jwtPayload)
            };
        } catch (error) {
            console.log('ERROR', error)
            if (error.code === 11000) {
                throw new ConflictException('This email already exists');
            }
            throw error;
        }
    }
}
