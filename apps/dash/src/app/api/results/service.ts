import {
  reverseTimeToSeconds,
  sortPositions,
  sortTeamPositions,
  timeToSeconds,
} from "@/utils/results";
import { CreateResultsDto } from "./dto";
import {
  EventGroupResultWithInfo,
  EventResultWithInfo,
} from "prisma/types/Results";
import { EventResult, Team } from "@prisma/client";
import { UserSession } from "@/middleware/functions/userSession.middleware";

export async function createEventResults(data: CreateResultsDto) {
  const registrationCodes = data.athletes.map((athlete) => athlete.code);

  const registrations = await prisma.eventRegistration.findMany({
    where: data.eventGroupId
      ? {
          eventGroupId: data.eventGroupId,
          code: { in: registrationCodes },
          status: { notIn: ["cancelled", "suspended"] },
        }
      : {
          eventId: data.eventId,
          code: { in: registrationCodes },
          status: { notIn: ["cancelled", "suspended"] },
        },
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

export async function readEventResults(eventId: string) {
  const allResults = await prisma.eventResult.findMany({
    where: { eventId },
    include: {
      Registration: {
        include: {
          user: { select: { fullName: true } },
          team: true,
          category: true,
          modality: true,
        },
      },
    },
  });

  const participants = Array.from(
    new Set(allResults.map((obj) => obj.Registration.id))
  );

  const allParticipantsResults: EventResultWithInfo[] = participants.map(
    (p, i) => {
      const details = allResults.find((r) => r.Registration.id === p)!;
      const participantResults = allResults.filter(
        (r) => r.Registration.id === p
      );

      let totalScore: number | null = 0;

      totalScore = participantResults.reduce((acc, curr) => {
        const time = curr.score;
        return acc + (time ?? 0);
      }, 0);

      return {
        ...details,
        score: totalScore || null,
      };
    }
  );

  return sortPositions(allParticipantsResults);
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
          modality: true,
        },
      },
    },
  });

  const events = Array.from(new Set(allResults.map((obj) => obj.eventId)));

  const participants = Array.from(
    new Set(allResults.map((obj) => obj.Registration.id))
  );

  const allParticipantsResults: EventGroupResultWithInfo[] = participants.map(
    (p, i) => {
      const details = allResults.find((r) => r.Registration.id === p)!;
      const participantResults = allResults.filter(
        (r) => r.Registration.id === p && r.score
      );

      if (
        rules.discard &&
        participantResults.length < rules.discard &&
        participantResults.length !== events.length
      ) {
        return {
          ...details,
          eventId: null,
          score: null,
        };
      }

      let totalScore: number | null = 0;

      if (rules.scoreCalculation === "sum") {
        if (rules.discard && rules.discard > 0) {
          const sortedScores = participantResults
            .map((result) => totalScore ?? 0)
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
            const time = Number(curr.score);
            return acc + (isNaN(time) ? 0 : time);
          }, 0);
        }
      } else if (rules.scoreCalculation === "average") {
        const validResults = participantResults
          .map((result) => Number(result.score))
          .filter((score) => !isNaN(score))
          .sort((a, b) => a - b);
        const numResults = Math.min(validResults.length, rules.discard || 0);

        totalScore =
          validResults.reduce((acc, curr) => acc + curr, 0) / numResults;

        totalScore = totalScore ? Math.round(totalScore) : null;
      }

      return {
        ...details,
        eventId: null,
        score: totalScore || null,
      };
    }
  );

  return { results: sortPositions(allParticipantsResults), events };
}

export async function readEventGroupResultsByTeam(eventGroupId: string) {
  const rules = await prisma.eventGroupRules.findUnique({
    where: { eventGroupId },
    include: {
      eventGroup: { include: { _count: { select: { Event: true } } } },
    },
  });

  if (!rules) throw "Regras do campeonato não encontradas.";

  const allResults = await prisma.eventResult.findMany({
    where: {
      Event: {
        EventGroup: { id: eventGroupId },
      },
      Registration: {
        teamId: { not: null }, // Exclude individual athletes without a team
      },
    },
    include: {
      Registration: {
        include: {
          user: { select: { fullName: true } },
          team: true,
        },
      },
    },
  });

  // Group results by team
  const teamResultsMap: { [teamId: string]: EventResultWithInfo[] } = {};

  allResults.forEach((result) => {
    const team = result.Registration.team;
    if (team) {
      const teamId = team.id;

      if (!teamResultsMap[teamId]) {
        teamResultsMap[teamId] = [];
      }
      teamResultsMap[teamId]!.push(result); // Use non-null assertion
    }
  });

  const teamResults: { team: Team; score: number | null }[] = [];

  for (const teamId in teamResultsMap) {
    const teamResultsForId = teamResultsMap[teamId];
    if (teamResultsForId) {
      // Check if teamResultsForId is defined
      let totalScore = 0;

      for (const result of teamResultsForId) {
        const timeInSeconds = Number(result.score);
        if (!isNaN(timeInSeconds)) {
          totalScore += timeInSeconds;
        }
      }

      if (rules.scoreCalculation === "average") {
        const numResults = teamResultsForId.length;
        totalScore /= numResults;

        totalScore = Math.round(totalScore);
      }

      const team = teamResultsForId[0]?.Registration.team;
      if (team) {
        teamResults.push({
          team,
          score: totalScore,
        });
      }
    }
  }

  return sortTeamPositions(teamResults);
}

export async function readUserEventGroupResults({
  eventGroupId,
  userSession,
}: {
  eventGroupId: string;
  userSession: UserSession;
}) {
  const registration = await prisma.eventRegistration.findFirst({
    where: { userId: userSession.id, eventGroupId, status: "active" },
  });
  if (!registration) throw "Inscrição não encontrada!";

  const results = await readEventGroupResults(eventGroupId);
  const userPosition = results.results.find(
    (r) => r.registrationId === registration.id
  );
  if (!userPosition) throw "Erro ao calcular posição!";
  const userResults = await prisma.eventResult.findMany({
    where: {
      registrationId: registration.id,
    },
    include: { Event: true },
  });

  return { results: userResults, position: userPosition.position || 0 };
}

export async function readUserEventResults({
  eventId,
  userSession,
}: {
  eventId: string;
  userSession: UserSession;
}) {
  const registration = await prisma.eventRegistration.findFirst({
    where: { userId: userSession.id, eventId, status: "active" },
  });
  if (!registration) throw "Inscrição não encontrada!";

  const results = await readEventResults(eventId);
  const userPosition = results.find(
    (r) => r.registrationId === registration.id
  );
  if (!userPosition) throw "Erro ao calcular posição!";
  const userResults = await prisma.eventResult.findMany({
    where: {
      registrationId: registration.id,
    },
    include: { Event: true },
  });

  return { results: userResults, position: userPosition.position || 0 };
}
