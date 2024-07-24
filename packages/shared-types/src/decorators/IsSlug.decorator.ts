import { registerDecorator, ValidationOptions } from "class-validator";

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isSlug",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          return typeof value === "string" && slugRegex.test(value);
        },
        defaultMessage() {
          return "Slug inválido. Por favor utilize apenas letras minúsculas, números e hífens.";
        },
      },
    });
  };
}
