import { PipeTransform, Injectable } from "@nestjs/common";
import {
  normalizeDocument,
  normalizeEmail,
} from "@/utils/validators/normalizers";
import { CreateUserDto } from "./dto/user.dto";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { hashInfo } from "@/utils/bCrypt";
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
      },
    };
  }
}
