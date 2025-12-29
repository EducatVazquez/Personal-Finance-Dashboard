import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info) {
        // If there's an error or no user, just return null instead of throwing an error
        return user || null;
    }
}