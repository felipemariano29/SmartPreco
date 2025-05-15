import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isURL, registerDecorator } from "class-validator";

export interface IsUrlOptions {
  /**
   * if true, allows `null`, `undefined` or `''` without validation error
   */
  nullable?: boolean;
}

@ValidatorConstraint({ name: 'IsUrl', async: false })
class IsUrlConstraint implements ValidatorConstraintInterface {
  public validate(value: any, args: ValidationArguments) {
    const [ options ] = args.constraints as [IsUrlOptions];
    const { nullable = false } = options;

    if (nullable && (value === null || value === undefined || value === '')) {
      return true;
    }

    return typeof value === 'string' && isURL(value);
  }

  public defaultMessage(args: ValidationArguments) {
    const [ options ] = args.constraints as [IsUrlOptions];
    const { nullable = false } = options;

    if (nullable) {
      return `${args.property} must be a valid URL, or empty/null is allowed`;
    }
    return `${args.property} must be a valid URL`;
  }
}

/**
 * Use @IsUrl({ nullable: true }) to also accept ''/null/undefined.
 * By default nullable = false.
 */
export function IsUrl(
  options: IsUrlOptions = { nullable: false },
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [ options ],
      options: validationOptions,
      validator: IsUrlConstraint,
    });
  };
}