import { PipeTransform, Injectable } from "@nestjs/common";
import { isEmail } from "class-validator";
import { LoginDto, normalizeDocument, normalizeEmail } from "shared-types";

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
