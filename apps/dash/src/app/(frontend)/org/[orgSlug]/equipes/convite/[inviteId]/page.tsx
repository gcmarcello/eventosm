import { joinTeam } from "@/app/api/teams/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";

export default async function InvitePage({
  params,
}: {
  params: { inviteId: string; orgSlug: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);
  const inviteId = params.inviteId;

  try {
    const updatedTeam = await joinTeam({
      teamId: inviteId,
      userSession,
    });
    redirect(
      `/perfil/equipes?alert=success&message=Você entrou na equipe com sucesso!`
    );
  } catch (error) {
    redirect(`/perfil/equipes?alert=error&message=${error}`);
  }
}
