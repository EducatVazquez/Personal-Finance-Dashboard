import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('google')
    async login(@Body('token') token: string) {
        // The frontend sends the Google credential here
        return this.authService.authenticateGoogle(token);
    }
}