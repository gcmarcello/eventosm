import { Prisma } from "@prisma/client";

type CreateRecoveryTokenParams = Prisma.PasswordRecoveryTokenCreateInput;

type ReadRecoveryTokenParams = {
  where: Prisma.PasswordRecoveryTokenWhereUniqueInput;
  select?: Prisma.PasswordRecoveryTokenSelect;
};

type UpsertRecoveryTokenParams = {
  where: Prisma.PasswordRecoveryTokenWhereUniqueInput;
  create: Prisma.PasswordRecoveryTokenCreateInput;
  update: Prisma.PasswordRecoveryTokenUpdateInput;
};

type UpdateRecoveryTokenParams = {
  where: Prisma.PasswordRecoveryTokenWhereUniqueInput;
  data: Prisma.PasswordRecoveryTokenUpdateInput;
};

type DeleteRecoveryTokenParams = {
  where: Prisma.PasswordRecoveryTokenWhereUniqueInput;
};

export async function createRecoveryToken(data: CreateRecoveryTokenParams) {
  return await prisma.passwordRecoveryToken.create({ data });
}

export async function readRecoveryToken(data: ReadRecoveryTokenParams) {
  return await prisma.passwordRecoveryToken.findUnique(data);
}

export async function upsertRecoveryToken(data: UpsertRecoveryTokenParams) {
  return await prisma.passwordRecoveryToken.upsert(data);
}

export async function updateRecoveryToken(data: UpdateRecoveryTokenParams) {
  return await prisma.passwordRecoveryToken.update(data);
}

export async function deleteRecoveryToken(data: DeleteRecoveryTokenParams) {
  return await prisma.passwordRecoveryToken.delete(data);
}
