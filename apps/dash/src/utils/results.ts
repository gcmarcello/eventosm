import { EventResult } from "@prisma/client";
import { EventResultWithInfo } from "prisma/types/Results";

export interface EventResultsWithPosition extends EventResultWithInfo {
  position: number;
}

function timeToSeconds(timeStr?: string | null): number | null {
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

export function sortPositions(resultArray: EventResultWithInfo[]) {
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

  const positions: EventResultsWithPosition[] = sortedArray.map(
    (obj, index) => ({
      ...obj,
      position: index + 1,
    })
  );
  return positions;
}
