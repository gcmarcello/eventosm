import { SidebarStackedLayout } from "odinkit";

export function DashboardLayout({
  children,
  sidebar,
  navbar,
  grow = true,
}: {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  navbar?: React.ReactNode;
  grow?: boolean;
}) {
  return (
    <SidebarStackedLayout grow={grow} navbar={navbar} sidebar={sidebar}>
      {children}
    </SidebarStackedLayout>
  );
}
