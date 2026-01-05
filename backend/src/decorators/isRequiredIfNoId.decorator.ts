import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRequiredIfNoId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isRequiredIfNoId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const dto = args.object as any;
                    // If category_id is missing, value (newCategoryName) must be a string
                    if (!dto.category_id) {
                        return typeof value === 'string' && value.trim().length > 0;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return 'newCategoryName is required when category_id is not provided';
                },
            },
        });
    };
}