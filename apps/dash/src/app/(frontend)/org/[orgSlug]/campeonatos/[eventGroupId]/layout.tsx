import { OrgLayoutContainer } from "../../_shared/components/OrgLayoutContainer";

export default function EventGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrgLayoutContainer>{children}</OrgLayoutContainer>;
}
