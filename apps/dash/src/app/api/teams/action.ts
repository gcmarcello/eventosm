"use server";
import { ActionResponse } from "odinkit";
import { AddTeamMembersDto, CreateTeamDto } from "./dto";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { revalidatePath } from "next/cache";
import { TeamOwnerMiddleware } from "@/middleware/functions/teamOwner.middleware";

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

export async function removeTeamMember(request: {
  teamId: string;
  userId: string;
}) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(TeamOwnerMiddleware);
    const removed = await service.removeTeamMember(parsedRequest);
    revalidatePath("/perfil/equipes");
    return ActionResponse.success({ data: removed });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function addTeamMembers(request: AddTeamMembersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(TeamOwnerMiddleware);

    const addedMembers = await service.addTeamMembers(parsedRequest);
    revalidatePath("/perfil/equipes");
    return ActionResponse.success({ data: addedMembers });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function joinTeam(request: { teamId: string }) {
  let joinedTeam;
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );
    joinedTeam = await service.joinTeam(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({ redirect: `/perfil/equipes/` });
}
