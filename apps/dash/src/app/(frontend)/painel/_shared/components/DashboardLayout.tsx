import { SidebarStackedLayout } from "odinkit";

export function DashboardLayout({
  children,
  sidebar,
  navbar,
}: {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  navbar?: React.ReactNode;
}) {
  return (
    <SidebarStackedLayout navbar={navbar} sidebar={sidebar}>
      {children}
    </SidebarStackedLayout>
  );
}
