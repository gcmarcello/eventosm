"use server";
import { ActionResponse } from "odinkit";
import { CreateTeamDto } from "./dto";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";

export async function createTeam(request: CreateTeamDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    const newTeam = await service.createTeam(parsedRequest);
    revalidatePath("/perfil/equipes");
    return ActionResponse.success({
      data: newTeam,
      message: "Time criado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function readTeams() {
  try {
    const {
      request: { userSession },
    } = await UseMiddlewares().then(UserSessionMiddleware);

    const teams = await service.readTeams({
      where: { ownerId: userSession.id },
    });

    return ActionResponse.success({ data: teams });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
