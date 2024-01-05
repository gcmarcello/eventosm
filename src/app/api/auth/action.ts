"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { LoginDto, SignupDto } from "./dto";
import { SignupMiddleware } from "@/middleware/functions/signup.middleware";
import * as service from "./service";
import { ActionResponse } from "../_shared/utils/ActionResponse";
import { cookies } from "next/headers";

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
    return ActionResponse.success({
      redirect: `/evento/${eventRedirect.id}/inscricao`,
    });
  }
  return ActionResponse.success({
    data: signup,
    message: "Usuário cadastrado com sucesso!",
  });
}

export async function login(request: LoginDto) {
  try {
    const login = await service.login(request);
    cookies().set("token", login);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
  return ActionResponse.success({
    redirect: "/",
  });
}

export async function logout() {
  try {
    cookies().delete("token");
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
  return ActionResponse.success({
    redirect: "/login",
  });
}
