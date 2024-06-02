import { DashboardLayout } from "../../painel/_shared/components/DashboardLayout";

export default function NewOrganizationPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
