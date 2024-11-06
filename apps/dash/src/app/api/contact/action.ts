"use server";
import { ActionResponse } from "odinkit";
import { CreateOrgTicketDto } from "./dto";
import * as service from "./service";

export async function createOrgTicket(data: CreateOrgTicketDto) {
  try {
    const response = await service.createOrgTicket(data);
    return ActionResponse.success({ data: response });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
