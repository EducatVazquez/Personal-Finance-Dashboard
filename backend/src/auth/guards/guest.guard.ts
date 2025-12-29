import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class GuestGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();

        if (request.user) {
            throw new ForbiddenException('You are already logged in.');
        }

        return true; // Allow the request to continue
    }
}