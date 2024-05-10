import { OrgCustomDomain, Organization } from "@prisma/client";

export function getOrganizationLink(
  organization?: (Organization & { OrgCustomDomain: OrgCustomDomain[] }) | null
) {
  if (!organization) return process.env.NEXT_PUBLIC_SITE_URL;
  return organization?.OrgCustomDomain[0]?.domain
    ? "https://" + organization?.OrgCustomDomain[0]?.domain
    : process.env.NEXT_PUBLIC_SITE_URL;
}
