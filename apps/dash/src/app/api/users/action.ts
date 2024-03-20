"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { CreateUserDocumentDto, UpdateUserDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import * as service from "./service";
import { ActionResponse } from "odinkit";
import { revalidatePath } from "next/cache";

export async function updateUser(request: UpdateUserDto) {
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
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function createUserDocument(request: CreateUserDocumentDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request).then(
      UserSessionMiddleware
    );

    const createdDocument = await service.createUserDocument(parsedRequest);
    revalidatePath("/perfil/documentos");
    return ActionResponse.success({
      data: createdDocument,
      message: "Documento criado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function getUserDocument(request: { id: string }) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(
    UserSessionMiddleware
  );

  try {
    const url = await service.getUserDocument(parsedRequest);
    return ActionResponse.success({ data: url });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

export async function deleteUserDocument(request: { id: string }) {
  const { request: parsedRequest } = await UseMiddlewares(request).then(
    UserSessionMiddleware
  );

  try {
    await service.deleteUserDocument(parsedRequest);
    revalidatePath("/perfil/documentos");
    return ActionResponse.success({
      data: parsedRequest.id,
      message: "Documento deletado com sucesso!",
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}
