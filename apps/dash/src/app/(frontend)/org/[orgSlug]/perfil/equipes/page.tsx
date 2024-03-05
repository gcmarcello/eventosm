import { readOrganizations } from "@/app/api/orgs/service";
import { readTeams } from "@/app/api/teams/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { notFound } from "next/navigation";
import { For } from "odinkit";
import { Button } from "odinkit/client";
import { useMemo } from "react";
import { NewTeamModal } from "../components/NewTeamModal";
import MembersDisclosure from "./components/MembersDisclosure";
import NewMemberModal from "./components/NewMemberModal";

export default async function ProfilePage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = (
    await readOrganizations({ where: { slug: params.orgSlug } })
  )[0];

  if (!organization) notFound();
  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);

  const teams = await prisma.team.findMany({
    where: { ownerId: userSession.id, status: { not: "deleted" } },
    include: { owner: true, User: true },
  });

  return (
    <>
      <div className="flex items-end justify-between lg:items-center">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Minhas Equipes
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Aqui você pode ver as equipes que você é administrador ou membro.
          </p>
        </div>
        <div>
          <NewTeamModal organization={organization} />
        </div>
      </div>
      <For each={teams}>
        {(team) => {
          return (
            <div className="rounded-b-md shadow-md">
              <div className="flex items-center justify-between rounded-t-md border-b border-gray-200 bg-slate-50 px-4 py-5  sm:px-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {team.name}
                </h3>
                {team.ownerId === userSession.id && (
                  <div className="flex gap-2">
                    <Button
                      disabled={true}
                      color={organization.options.colors.primaryColor.tw.color}
                    >
                      Editar
                    </Button>
                    <NewMemberModal
                      organization={organization}
                      teamId={team.id}
                    />
                  </div>
                )}
              </div>
              <li
                style={{
                  borderColor: organization.options.colors.primaryColor.hex,
                }}
                className="flex gap-x-4 border-2 px-4 py-5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {team.owner.fullName}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    Administrador
                  </p>
                </div>
              </li>
              <li className="flex  gap-x-4 px-4 py-5">
                <div className="w-full min-w-0">
                  {team.User.length > 1 && (
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      Outros {team.User.length - 1} membros
                    </p>
                  )}
                  <MembersDisclosure
                    teamId={team.id}
                    members={team.User}
                  ></MembersDisclosure>
                </div>
              </li>
            </div>
          );
        }}
      </For>
    </>
  );
}
