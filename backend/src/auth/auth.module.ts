import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserSchema } from '@/users/schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        // 1. Connect to the User collection
        PassportModule.register({ defaultStrategy: 'jwt' }),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        // 2. Configure JWT settings
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'fallback_secret', // Use .env in production
            signOptions: { expiresIn: '1d' }, // Token lasts 1 day
        })
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule { }