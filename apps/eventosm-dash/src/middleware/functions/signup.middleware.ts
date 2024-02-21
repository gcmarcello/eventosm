"use server";
import { SignupDto } from "@/app/api/auth/dto";
import { normalize, normalizeEmail, normalizePhone } from "odinkit";

export async function SignupMiddleware({ request }: { request: SignupDto }) {
  const eventRedirect = request.eventRedirect && { ...request.eventRedirect };

  const existingDocument = await prisma.user.findFirst({
    where: {
      document: normalize(request.document.value),
    },
  });
  if (existingDocument) throw "Documento já cadastrado";

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: normalizeEmail(request.email),
    },
  });
  if (existingEmail) throw "Email já cadastrado";

  const existingPhone = await prisma.user.findFirst({
    where: {
      phone: normalizePhone(request.phone),
    },
  });
  if (existingPhone) throw "Telefone já cadastrado";

  return {
    request,
    eventRedirect,
  };
}
