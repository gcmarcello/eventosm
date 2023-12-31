"use server";
import { SignupDto } from "@/app/api/auth/dto";
import { normalize, normalizeEmail, normalizePhone } from "@/utils/format";

export async function SignupMiddleware({ request }: { request: SignupDto }) {
  const parsedRequest = { ...request.step1, ...request.step2 };
  const eventRedirect = request.eventRedirect && { ...request.eventRedirect };

  const existingDocument = await prisma.user.findFirst({
    where: {
      document: normalize(parsedRequest.document.value),
    },
  });
  if (existingDocument) throw "Documento já cadastrado";

  const existingEmail = await prisma.user.findFirst({
    where: {
      email: normalizeEmail(parsedRequest.email),
    },
  });
  if (existingEmail) throw "Email já cadastrado";

  const existingPhone = await prisma.user.findFirst({
    where: {
      phone: normalizePhone(parsedRequest.phone),
    },
  });
  if (existingPhone) throw "Telefone já cadastrado";

  return {
    parsedRequest,
    eventRedirect,
  };
}
