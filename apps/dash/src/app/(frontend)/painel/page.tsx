import { Divider, Heading } from "odinkit";
import { DashboardLayout } from "./_shared/components/DashboardLayout";

export default async function PanelPage() {
  return (
    <DashboardLayout>
      <Heading>Painel da Organização</Heading>
      <Divider className="my-8" />
    </DashboardLayout>
  );
}
