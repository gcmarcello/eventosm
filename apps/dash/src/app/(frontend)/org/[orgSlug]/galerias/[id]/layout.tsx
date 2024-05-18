import { OrgLayoutContainer } from "../../_shared/components/OrgLayoutContainer";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrgLayoutContainer>{children}</OrgLayoutContainer>;
}
