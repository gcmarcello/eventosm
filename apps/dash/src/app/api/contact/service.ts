import prisma from "prisma/prisma";
import { CreateContactDto } from "./dto";

export async function createContact(data: CreateContactDto) {
  return await prisma;
}
