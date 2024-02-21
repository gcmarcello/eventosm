"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { LoginDto, SignupDto } from "./dto";
import { SignupMiddleware } from "@/middleware/functions/signup.middleware";
import * as service from "./service";
import { cookies } from "next/headers";
import path from "path";
import { ActionResponse } from "odinkit";

export async function signup(request: SignupDto) {
  let eventRedirect;
  let signup;

  try {
    const { request: parsedRequest, eventRedirect: redirect } =
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
  const { redirect, ...loginInfo } = request;

  try {
    const login = await service.login(loginInfo);
    cookies().set("token", login);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: redirect,
  });
}

export async function logout(pathName?: string) {
  try {
    cookies().delete("token");
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
  return ActionResponse.success({
    redirect: pathName || "/login",
  });
}
