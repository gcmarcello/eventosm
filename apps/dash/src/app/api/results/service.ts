import { CreateResultsDto } from "./dto";

export async function createEventResults(data: CreateResultsDto) {
  const registrationCodes = data.athletes.map((athlete) => athlete.code);

  const registrations = await prisma.eventRegistration.findMany({
    where: data.eventGroupId
      ? { eventGroupId: data.eventGroupId, code: { in: registrationCodes } }
      : { eventId: data.eventId, code: { in: registrationCodes } },
    select: { id: true, code: true },
  });

  const resultsData = registrationCodes.map((code) => {
    const registration = registrations.find((r) => r.code === code);
    if (!registration)
      throw `Inscrição com o número ${code} não foi encontrada.`;
    return {
      eventId: data.eventId,
      registrationId: registration.id,
      score: data.athletes.find((a) => a.code === code)?.score || null,
    };
  });

  return await prisma.eventResult.createMany({
    data: resultsData,
  });
}
