import { OrgLayoutContainer } from "../../_shared/components/OrgLayoutContainer";

export default function EventPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrgLayoutContainer>{children}</OrgLayoutContainer>;
}
