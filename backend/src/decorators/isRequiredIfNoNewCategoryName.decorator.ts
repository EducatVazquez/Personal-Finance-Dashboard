import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsRequiredIfNoNewCategoryName(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isRequiredIfNoNewCategoryName',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const dto = args.object as any;
                    // If category_id is missing, value (newCategoryName) must be a string
                    if (!dto.newCategoryName) {
                        return typeof value === 'string' && value.trim().length > 0;
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    return 'category_id is required when newCategoryName is not provided';
                },
            },
        });
    };
}