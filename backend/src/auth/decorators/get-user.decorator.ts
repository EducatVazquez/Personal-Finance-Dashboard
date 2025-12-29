import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return null;

        const value = data ? user[data] : user;

        // If the value has a .toString() method (like ObjectId), use it.
        // This ensures '_id' becomes a string '6951b802...'

        console.log('Value', value, 'user', user);
        return value && value.toString ? value.toString() : value;
    },
);