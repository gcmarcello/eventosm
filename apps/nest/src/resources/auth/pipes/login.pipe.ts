import { PipeTransform, Injectable } from "@nestjs/common";
import { isEmail } from "class-validator";
import { normalizeDocument, normalizeEmail } from "shared-types";
import { LoginDto } from "shared-types/dist/resources/auth/auth.dto";

@Injectable()
export class LoginPipe implements PipeTransform {
  transform(value: LoginDto) {
    const isIdentifierEmail = isEmail(value.identifier);
    const normalizedIdentifier = isIdentifierEmail
      ? normalizeEmail(value.identifier)
      : normalizeDocument(value.identifier);

    return {
      ...value,
      identifier: normalizedIdentifier,
      isEmail: isIdentifierEmail,
    };
  }
}
