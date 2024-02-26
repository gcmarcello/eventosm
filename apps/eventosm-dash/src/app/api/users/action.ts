"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { UpdateUserDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import * as service from "./service";
import { ActionResponse } from "odinkit";
import { revalidatePath } from "next/cache";

export async function updateUser({ request }: { request: UpdateUserDto }) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    const updatedUser = await service.updateUser({ request: parsedRequest });
    revalidatePath("/perfil");
    return ActionResponse.success({
      data: updatedUser,
      message: "Usuário atualizado com sucesso!",
    });
  } catch (error) {
    return ActionResponse.error("Erro ao atualizar usuário.");
  }
}
