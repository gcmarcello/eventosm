import { Organization } from "@prisma/client";
import { Heading } from "odinkit";
import { Link } from "odinkit/client";

export default function SubeventHeading({
  children,
  organization,
  eventGroupId,
}: {
  children: React.ReactNode;
  organization: Organization;
  eventGroupId: string;
}) {
  return (
    <div className="mb-3 items-end gap-2 lg:flex">
      <Heading>{children} - </Heading>
      <Link
        className="text-sm"
        style={{
          color: organization.options.colors.primaryColor.hex,
        }}
        href={`/painel/eventos/grupos/${eventGroupId}/etapas`}
      >
        Voltar à lista de etapas
      </Link>
    </div>
  );
}
