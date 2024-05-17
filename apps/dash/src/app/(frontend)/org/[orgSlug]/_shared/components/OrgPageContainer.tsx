import clsx from "clsx";
import OrgFooter from "../../../_shared/OrgFooter";
import { OrganizationWithDomain } from "prisma/types/Organization";

export function OrgPageContainer({
  organization,
  children,
  className,
  footer = true,
}: {
  organization: OrganizationWithDomain;
  children: React.ReactNode;
  className?: string;
  footer?: boolean;
}) {
  return (
    <>
      <div className={clsx(className)}>{children}</div>
      {footer && <OrgFooter organization={organization} />}
    </>
  );
}
