import { OrgCustomDomain, Organization } from "@prisma/client";

export type OrganizationWithDomain = Organization & {
  OrgCustomDomain: OrgCustomDomain[];
};
