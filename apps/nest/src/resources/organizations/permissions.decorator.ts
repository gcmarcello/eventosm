import { Reflector } from "@nestjs/core";
import { OrganizationPermissions } from "shared-types";

export const Permissions =
  Reflector.createDecorator<OrganizationPermissions[]>();
