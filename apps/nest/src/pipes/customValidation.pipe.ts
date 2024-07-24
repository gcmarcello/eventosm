import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
  ValidationPipeOptions,
} from "@nestjs/common";
import { PropertyError } from "shared-types";

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: (errors: ValidationError[]) =>
        this.createException(errors),
    });
  }

  getChildrenErrors(
    error: ValidationError,
    parentProperty = ""
  ): PropertyError[] {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;
    let accumulatedErrors: PropertyError[] = [];

    if (error.constraints) {
      accumulatedErrors.push({
        property: propertyPath,
        constraints: error.constraints,
      });
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach((child) => {
        accumulatedErrors = accumulatedErrors.concat(
          this.getChildrenErrors(child, propertyPath)
        );
      });
    }

    return accumulatedErrors;
  }

  private createException(errors: ValidationError[]) {
    const formattedErrors: PropertyError[] = errors.flatMap((error) =>
      this.getChildrenErrors(error)
    );

    return new BadRequestException({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
}
