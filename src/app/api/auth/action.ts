"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { SignupDto } from "./dto";
import { SignupMiddleware } from "@/middleware/functions/signup.middleware";
import * as service from "./service";
import { ActionResponse } from "../_shared/utils/ActionResponse";

export async function signup(request: SignupDto) {
  try {
    const { parsedRequest, eventRedirect } =
      await UseMiddlewares(request).then(SignupMiddleware);
    const signup = await service.signup(parsedRequest);
    if (eventRedirect) {
      return ActionResponse.redirect({
        href: `/evento/${eventRedirect.id}/inscricao`,
      });
    }
    return ActionResponse.success({
      data: signup,
      message: "Usuário cadastrado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

/* export async function login(request: any) {
  try {
    const login = await service.login(request);
    return ActionResponse.success({
      data: login,
      message: "Usuário logado com sucesso!",
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
} */
