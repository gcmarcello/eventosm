"use server";
import { ActionResponse } from "odinkit";
import { AdminUpdateUserDto } from "./dto";
import * as service from "./service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { AdminMiddleware } from "@/middleware/functions/admin.middleware";
import { revalidatePath } from "next/cache";

export async function adminUpdateUser(request: AdminUpdateUserDto) {
  try {
    console.log("xd");
    const { request: parsedRequest } =
      await UseMiddlewares(request).then(AdminMiddleware);

    const updatedUser = await service.updateUser(parsedRequest);

    revalidatePath("/admin/usuarios");
    return ActionResponse.success({
      message: "Usuário atualizado com sucesso.",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
