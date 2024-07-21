import { PipeTransform, Injectable } from "@nestjs/common";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { hashInfo } from "@/utils/bCrypt";
import {
  CreateUserDto,
  normalizeDocument,
  normalizeEmail,
  normalizeZipCode,
} from "shared-types";
dayjs.extend(customParseFormat);

@Injectable()
export class UserPipe implements PipeTransform {
  async transform(value: CreateUserDto) {
    return {
      ...value,
      document: normalizeDocument(value.document),
      email: normalizeEmail(value.email),
      password: await hashInfo(value.password),
      info: {
        ...value.info,
        birthDate: dayjs(value.info.birthDate, "DD/MM/YYYY").toDate(),
        zipCode: normalizeZipCode(value.info.zipCode),
      },
    };
  }
}
