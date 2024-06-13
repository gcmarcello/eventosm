import { PipeTransform, Injectable } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { isEmail } from "class-validator";
import {
  normalizeDocument,
  normalizeEmail,
} from "@/utils/validators/normalizers";

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
