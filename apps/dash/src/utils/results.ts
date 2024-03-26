import { EventResult } from "@prisma/client";
import { EventResultWithInfo } from "prisma/types/Results";

export interface EventResultsWithPosition extends EventResultWithInfo {
  position: number;
}

function timeToSeconds(timeStr?: string | null): number | "DNF" {
  if (!timeStr) return "DNF";
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  if (!hours || !minutes || !seconds) return "DNF";
  return hours * 3600 + minutes * 60 + seconds;
}

export function sortPositions(resultArray: EventResultWithInfo[]) {
  const sortedArray = resultArray.sort((a, b) => {
    const aTime = timeToSeconds(a.score);
    const bTime = timeToSeconds(b.score);
    if (aTime === "DNF" || bTime === "DNF") return 1;
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
