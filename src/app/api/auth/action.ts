"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { SignupDto } from "./dto";
import { SignupMiddleware } from "@/middleware/functions/signup.middleware";
import * as service from "./service";
import { ActionResponse } from "../_shared/utils/ActionResponse";

export async function signup(request: SignupDto) {
  let eventRedirect;
  let signup;

  try {
    const { parsedRequest, eventRedirect: redirect } =
      await UseMiddlewares(request).then(SignupMiddleware);
    signup = await service.signup(parsedRequest);

    eventRedirect = redirect || undefined;
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  if (eventRedirect) {
    return ActionResponse.redirect({
      href: `/evento/${eventRedirect.id}/inscricao`,
    });
  }
  return ActionResponse.success({
    data: signup,
    message: "Usuário cadastrado com sucesso!",
  });
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
