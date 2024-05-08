"use server";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { LoginDto, SignupDto } from "./dto";
import { SignupMiddleware } from "@/middleware/functions/signup.middleware";
import * as service from "./service";
import { cookies } from "next/headers";
import path from "path";
import { ActionResponse } from "odinkit";
import { User } from "@prisma/client";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";

export async function signup(request: SignupDto) {
  let signup;

  try {
    const { request: parsedRequest } =
      await UseMiddlewares(request).then(SignupMiddleware);
    signup = await service.signup(parsedRequest);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: `/login?alert=successRegistration`,
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
    if ((error as User).fullName) {
      console.log("error");
      return ActionResponse.success({ data: error });
    }
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
    redirect: "/",
  });
}

export async function resendConfirmationEmail(request: { userId: string }) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(OrganizationMiddleware);
    const resend = await service.resendConfirmationEmail(parsedRequest);
    return ActionResponse.success({
      data: resend,
      message: "Email de confirmação reenviado com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function readUserFromDocument(request: {
  document: string;
  organizationId: string;
}) {
  try {
    const user = await service.readUserFromDocument(request);
    return ActionResponse.success({ data: user });
  } catch (error) {
    return ActionResponse.error(error);
  }
}
