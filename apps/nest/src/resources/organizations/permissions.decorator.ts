import { Reflector } from "@nestjs/core";
import { OrganizationPermissions } from "./entities/organizationPermission.entity";

export const Permissions =
  Reflector.createDecorator<OrganizationPermissions[]>();
