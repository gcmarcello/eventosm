import { PipeTransform, Injectable } from "@nestjs/common";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  CreateOrganizationDto,
  normalizeDocument,
  normalizeEmail,
} from "shared-types";
dayjs.extend(customParseFormat);

@Injectable()
export class OrganizationPipe implements PipeTransform {
  async transform(value: CreateOrganizationDto) {
    if (typeof value === "string") return value;
    return {
      ...value,
      document: value.document ? normalizeDocument(value.document) : undefined,
      email: value.email ? normalizeEmail(value.email) : undefined,
      slug: value.slug.toLowerCase(),
    };
  }
}
