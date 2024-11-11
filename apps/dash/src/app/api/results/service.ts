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
import { EventRegistration, EventResult, Team } from "@prisma/client";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import prisma from "prisma/prisma";

export async function createEventResults(data: CreateResultsDto) {
  const registrationCodes = data.athletes.map((athlete) => athlete.code);

  const registrations = await prisma.eventRegistration.findMany({
    where: data.eventGroupId
      ? {
          eventGroupId: data.eventGroupId,
          code: { in: registrationCodes },
          status: { notIn: ["suspended"] },
        }
      : {
          eventId: data.eventId,
          code: { in: registrationCodes },
          status: { notIn: ["suspended"] },
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
    where: { eventId, Registration: { status: { not: "suspended" } } },
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
      eventGroup: { include: { Event: true } },
    },
  });

  if (!rules) throw "Regras do campeonato não encontradas.";

  const allResults = await prisma.eventResult.findMany({
    where: {
      Event: { EventGroup: { id: eventGroupId } },
      status: "active",
      Registration: { status: { not: "suspended" } },
    },
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

  const totalEvents = new Set(allResults.map((obj) => obj.eventId)).size;
  const discardLimit = rules.discard || 0;
  const minResultsRequired = totalEvents - discardLimit;

  const participants = Array.from(
    new Set(allResults.map((obj) => obj.Registration.id))
  );

  const allParticipantsResults: EventGroupResultWithInfo[] = participants.map(
    (participantId) => {
      const participantResults = allResults
        .filter(
          (result) => result.Registration.id === participantId && result.score
        )
        .map((result) => Number(result.score))
        .filter((score) => !isNaN(score))
        .sort((a, b) => a - b); // Sort scores for easy discarding

      const details = allResults.find(
        (result) => result.Registration.id === participantId
      );

      if (!details || participantResults.length === 0) {
        return {
          ...details!,
          eventId: null,
          score: null,
        };
      }

      let totalScore: number | null = 0;

      // Check if the racer has enough results to be included in the ranking
      if (participantResults.length < minResultsRequired) {
        return {
          ...details!,
          eventId: null,
          score: null,
        };
      }

      // Determine if enough results exist to discard
      if (participantResults.length - discardLimit >= discardLimit) {
        const validScores = participantResults.slice(
          0,
          participantResults.length - discardLimit
        );

        if (rules.scoreCalculation === "sum") {
          totalScore = validScores.reduce((acc, curr) => acc + curr, 0);
        } else if (rules.scoreCalculation === "average") {
          totalScore =
            validScores.reduce((acc, curr) => acc + curr, 0) /
            validScores.length;
          totalScore = Math.round(totalScore); // Round to the nearest integer
        }
      } else {
        // If not enough results to discard, sum or average all results
        if (rules.scoreCalculation === "sum") {
          totalScore = participantResults.reduce((acc, curr) => acc + curr, 0);
        } else if (rules.scoreCalculation === "average") {
          totalScore =
            participantResults.reduce((acc, curr) => acc + curr, 0) /
            participantResults.length;
          totalScore = Math.round(totalScore); // Round to the nearest integer
        }
      }

      return {
        ...details!,
        eventId: null,
        score: totalScore || null,
      };
    }
  );

  return {
    results: sortPositions(allParticipantsResults),
    events: Array.from(new Set(allResults.map((obj) => obj.eventId))),
  };
}

export async function readEventGroupResultsByTeam(eventGroupId: string) {
  const results = await readEventGroupResults(eventGroupId);

  const events = await prisma.event.count({
    where: { eventGroupId },
  });

  const uniqueTeams = Array.from(
    new Set(results.results.map((r) => r.Registration.teamId).filter((t) => t))
  );

  const teamResults = uniqueTeams.map((teamId) => {
    const teamResults = results.results.filter(
      (r) => r.Registration.teamId === teamId && r.score
    );

    const team = results.results.find((r) => r.Registration.teamId === teamId)
      ?.Registration.team!;

    if (teamResults.length < 7) return { team, score: null };

    const totalScore =
      teamResults
        .sort((a, b) => a.score! - b.score!)
        .splice(0, 7)
        .reduce((acc, curr) => acc + (curr.score || 0), 0) / 7;

    return {
      team,
      score: Math.round(totalScore),
    };
  });

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
