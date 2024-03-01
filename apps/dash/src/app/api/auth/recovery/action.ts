"use server";
import { ActionResponse } from "odinkit";
import * as service from "./service";
import { CreateNewPasswordDto, UpsertPasswordRecoveryTokenDto } from "./dto";
import { cookies } from "next/headers";

export async function generateRecoveryToken(
  request: UpsertPasswordRecoveryTokenDto
) {
  let parsedEmail;
  try {
    const { recoveryToken: token, email } =
      await service.generateRecoveryToken(request);

    parsedEmail = email;
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }

  return ActionResponse.success({
    redirect: `/login?alert=successRecovery&email=${parsedEmail}`,
  });
}

export async function createNewPassword(request: CreateNewPasswordDto) {
  try {
    const token = await service.createNewPassword(request);
    cookies().set("token", token);
  } catch (error) {
    return ActionResponse.error(error);
  }
  return ActionResponse.success({
    redirect: "/",
  });
}
