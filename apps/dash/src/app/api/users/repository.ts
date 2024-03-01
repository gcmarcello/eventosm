import { Prisma } from "@prisma/client";

type UpdateUserParams = {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
};

type CreateUserParams = Prisma.UserCreateInput;

type ReadUserParams = {
  where: Prisma.UserWhereUniqueInput;
  select?: Prisma.UserSelect;
};

type ReadUsersParams = {
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationAndSearchRelevanceInput;
  cursor?: Prisma.UserWhereUniqueInput;
  take?: number;
  skip?: number;
  select?: Prisma.UserSelect;
};

type DeleteUserParams = {
  where: Prisma.UserWhereUniqueInput;
};

type UpsertUser = {
  where: Prisma.UserWhereUniqueInput;
  create: Prisma.UserCreateInput;
  update: Prisma.UserUpdateInput;
};

export async function readUserUnique(params: ReadUserParams) {
  return await prisma.user.findUnique(params);
}

export async function readUsers(params: ReadUsersParams) {
  return await prisma.user.findMany(params);
}

export async function createUser(params: CreateUserParams) {
  return await prisma.user.create({ data: params });
}

export async function updateUser(params: UpdateUserParams) {
  return await prisma.user.update(params);
}

export async function deleteUser(params: DeleteUserParams) {
  return await prisma.user.delete(params);
}

export async function upsertUser(params: UpsertUser) {
  return await prisma.user.upsert(params);
}
