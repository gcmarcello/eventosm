import prisma from "prisma/prisma";
import { CreateOrgTicketDto } from "./dto";
import { sendEmail } from "../emails/service";
import { Email } from "email-templates";
import { getServerEnv } from "../env";

export async function createOrgTicket(data: CreateOrgTicketDto) {
  const newTicket = await prisma.ticket.create({
    data,
    include: {
      organization: true,
    },
  });

  const { organization } = newTicket;

  const confirmationEmail: Email<"protocol_confirmation">[] = [
    {
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Inscrição confirmada",
        to: data.email,
      },
      template: "protocol_confirmation",
      templateParameters: {
        headerTextColor:
          organization?.options.colors.primaryColor.hex ?? "#000",
        mainColor: organization?.options.colors.primaryColor.hex ?? "#000",
        name: data.name,
        orgName: organization?.name ?? "",
        protocolNumber: newTicket.id,
      },
    },
  ];

  const newTicketEmail: Email<"new_protocol">[] = [
    {
      setup: {
        from: getServerEnv("SENDGRID_EMAIL")!,
        subject: "Novo Chamado Recebido - " + organization?.name,
        to: organization?.email ?? "",
        replyTo: data.email,
      },
      template: "new_protocol",
      templateParameters: {
        headerTextColor:
          organization?.options.colors.primaryColor.hex ?? "#000",
        mainColor: organization?.options.colors.primaryColor.hex ?? "#000",
        email: data.email,
        name: data.name,
        phone: data.phone,
        orgName: organization?.name ?? "",
      },
    },
  ];

  await sendEmail([...confirmationEmail, ...newTicketEmail]);

  return newTicket;
}
