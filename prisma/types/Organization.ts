import { Organization } from "@prisma/client";

export type OrganizationWithOptions = Omit<Organization, "options"> & {
  options: {
    abbreviation: string;
    logo: string;
  };
};
