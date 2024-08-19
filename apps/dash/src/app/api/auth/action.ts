"use server";
import * as service from "./service";
import { cookies } from "next/headers";
import { ActionResponse } from "odinkit";
import { LoginDto } from "shared-types/dist/index.client";

/* export async function signup(request: SignupDto) {
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
} */

/* export async function resendConfirmationEmail(request: { userId: string }) {
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
} */

/* export async function readUserFromDocument(request: {
  document: string;
  organizationId: string;
}) {
  try {
    const user = await service.readUserFromDocument(request);
    return ActionResponse.success({ data: user });
  } catch (error) {
    return ActionResponse.error(error);
  }
} */

export async function updateActiveOrganization(id: string) {
  try {
    const updatedToken = await service.updateActiveOrganization(id);
    return ActionResponse.success({ data: updatedToken });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function login(request: LoginDto) {
  let login;
  try {
    login = await service.login(request);
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    data: login,
    redirect: "/painel",
    message: "Usuário autenticado com sucesso!",
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
    data: "Usuário deslogado com sucesso!",
    redirect: "/login",
  });
}

export async function setCookie(data: string, name: string) {
  cookies().set(name, data);
  return;
}
