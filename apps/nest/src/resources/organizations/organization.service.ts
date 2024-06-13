import { Injectable } from "@nestjs/common";

@Injectable()
export class OrganizationService {
  constructor() {}

  async create() {
    return "create";
  }
}
