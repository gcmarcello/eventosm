"use server";
import { ActionResponse } from "odinkit";
import * as service from "./service";

export async function readAddressFromZipCode({ zipCode }: { zipCode: string }) {
  try {
    const address = await service.readAddressFromZipCode({ zipCode });
    return ActionResponse.success({
      data: address,
      message: "Informações encontradas com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
