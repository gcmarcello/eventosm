import { OrgLayoutContainer } from "../_shared/components/OrgLayoutContainer";

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrgLayoutContainer>{children}</OrgLayoutContainer>;
}
