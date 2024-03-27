import {
  reverseTimeToSeconds,
  sortPositions,
  timeToSeconds,
} from "@/utils/results";
import { CreateResultsDto } from "./dto";
import { EventResultWithInfo } from "prisma/types/Results";

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

export async function readEventGroupResults(eventGroupId: string) {
  const rules = await prisma.eventGroupRules.findUnique({
    where: { eventGroupId },
    include: {
      eventGroup: { include: { _count: { select: { Event: true } } } },
    },
  });

  if (!rules) throw "Regras do campeonato não encontradas.";

  const allResults = await prisma.eventResult.findMany({
    where: { Event: { EventGroup: { id: eventGroupId } } },
    include: {
      Registration: {
        include: {
          user: { select: { fullName: true } },
          team: true,
          category: true,
        },
      },
    },
  });

  const participants = Array.from(
    new Set(allResults.map((obj) => obj.Registration.id))
  );

  const allParticipantsResults: EventResultWithInfo[] = participants.map(
    (p) => {
      const details = allResults.find((r) => r.Registration.id === p)!;
      const participantResults = allResults.filter(
        (r) => r.Registration.id === p
      );
      let totalScore = 0;

      // Only consider the best results if discard value is provided
      if (rules.discard && rules.discard > 0) {
        const sortedScores = participantResults
          .map((result) => Number(timeToSeconds(result.score)))
          .filter((score) => !isNaN(score))
          .sort((a, b) => a - b);

        // Ensure we have enough results to discard
        if (rules.discard < sortedScores.length) {
          // Calculate total score by excluding worst x results
          const validScores = sortedScores.slice(
            0,
            sortedScores.length - rules.discard
          );
          totalScore = validScores.reduce((acc, curr) => acc + curr, 0);
        } else {
          // If there are fewer results than the number to discard, use all results
          totalScore = sortedScores.reduce((acc, curr) => acc + curr, 0);
        }
      } else {
        // Calculate total score without discarding any results
        totalScore = participantResults.reduce((acc, curr) => {
          const time = Number(timeToSeconds(curr.score));
          return acc + (isNaN(time) ? 0 : time);
        }, 0);
      }
      return {
        ...details,
        score: reverseTimeToSeconds(totalScore),
      };
    }
  );

  return sortPositions(allParticipantsResults);
}
