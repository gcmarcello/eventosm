import { readOrganizations } from "@/app/api/orgs/service";
import { readTeams } from "@/app/api/teams/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { notFound } from "next/navigation";
import { For } from "odinkit";
import { Button } from "odinkit/client";
import { useMemo } from "react";

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
  const teams = await readTeams({ where: { ownerId: userSession.id } });

  return (
    <For each={teams}>
      {(team) => {
        return (
          <div className="rounded-b-md shadow-md">
            <div className="flex items-center justify-between rounded-t-md border-b border-gray-200 bg-slate-50 px-4 py-5  sm:px-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {team.name}
              </h3>
              {team.ownerId === userSession.id && (
                <Button
                  disabled={true}
                  color={organization.options.colors.primaryColor.tw.color}
                >
                  Editar
                </Button>
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
                  {team.User.find((user) => user.id === team.ownerId)!.fullName}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  Administrador
                </p>
              </div>
            </li>
            <For each={team.User}>
              {(user) => {
                if (user.id === team.ownerId) return <></>;
                return (
                  <li className="flex gap-x-4 px-4 py-5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        {user._count.EventRegistration}{" "}
                        {`participaç${user._count.EventRegistration === 1 ? "ão" : "ões"}`}
                      </p>
                    </div>
                  </li>
                );
              }}
            </For>
          </div>
        );
      }}
    </For>
  );
}
