import { UserSession } from "@/middleware/functions/userSession.middleware";
import { ReadEventAddonDto, UpsertEventAddonDto } from "./dto";
import { Organization } from "@prisma/client";
import prisma from "prisma/prisma";

export async function readEventAddons(request: ReadEventAddonDto) {
  return await prisma.eventAddon.findMany({
    where: request.where,
  });
}

export async function upsertEventAddon(
  request: UpsertEventAddonDto & {
    userSession: UserSession;
    organization: Organization;
  }
) {
  const { organization, userSession, options, ...rest } = request;
  const parsedPrice = request.price.replace(",", ".");
  if (isNaN(Number(parsedPrice)))
    throw "O preço precisa ser um número válido ou 0.";
  const price = Math.round(10 * Number(parsedPrice)) / 10;
  const parsedOptions = options?.map((option) => option.name);

  const id = rest.id || crypto.randomUUID();
  const upsertedAddon = await prisma.eventAddon.upsert({
    where: { id },
    update: { ...rest, id, options: parsedOptions, price, status: "active" },
    create: { ...rest, id, options: parsedOptions, price, status: "active" },
  });

  return upsertedAddon;
}
