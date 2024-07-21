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

  private createException(errors: ValidationError[]) {
    const formattedErrors: PropertyError[] = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }));

    return new BadRequestException({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
}
