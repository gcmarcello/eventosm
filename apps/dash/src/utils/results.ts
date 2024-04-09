import { EventResult, Team } from "@prisma/client";
import {
  EventGroupResultWithInfo,
  EventResultWithInfo,
} from "prisma/types/Results";

export interface EventResultsWithPosition extends EventResultWithInfo {
  position: number;
}

export function timeToSeconds(timeStr?: string | null): number | null {
  if (!timeStr) return null;
  const [hoursStr, minutesStr, secondsStr] = timeStr
    .split(":")
    .map((part) => part || "0");
  if (!hoursStr || !minutesStr || !secondsStr) return null;
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);
  const seconds = parseInt(secondsStr);

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;

  return hours * 3600 + minutes * 60 + seconds;
}

export function reverseTimeToSeconds(seconds: number | null): string | null {
  if (seconds === null || seconds === 0) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function sortPositions(
  resultArray: EventResultWithInfo[] | EventGroupResultWithInfo[]
) {
  const sortedArray = resultArray.sort((a, b) => {
    const aTime = a.score !== null ? timeToSeconds(a.score) : null;
    const bTime = b.score !== null ? timeToSeconds(b.score) : null;
    if (aTime === null && bTime === null) {
      return 0; // If both times are null, consider them equal
    } else if (aTime === null) {
      return 1; // If only aTime is null, consider it greater
    } else if (bTime === null) {
      return -1; // If only bTime is null, consider it greater
    }
    return aTime - bTime;
  });

  const positions: EventResultsWithPosition[] | EventGroupResultWithInfo[] =
    sortedArray.map((obj, index) => ({
      ...obj,
      position: index + 1,
    }));
  return positions;
}

export function sortTeamPositions(
  resultArray: { team: Team; score: number | null }[]
) {
  const sortedArray = resultArray.sort((a, b) => {
    const aTime = a.score;
    const bTime = b.score;
    if (aTime === null && bTime === null) {
      return 0; // If both times are null, consider them equal
    } else if (aTime === null) {
      return 1; // If only aTime is null, consider it greater
    } else if (bTime === null) {
      return -1; // If only bTime is null, consider it greater
    }
    return aTime - bTime;
  });

  const positions = sortedArray.map((obj, index) => ({
    ...obj,
    position: index + 1,
  }));
  return positions;
}
