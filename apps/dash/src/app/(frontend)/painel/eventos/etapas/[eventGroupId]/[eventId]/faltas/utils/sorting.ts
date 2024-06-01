import { readSubeventReviewData } from "@/app/api/events/action";
import { EventAbsences } from "@prisma/client";
import { ExtractSuccessResponse } from "odinkit";

export function sortAbsences(
  absences: ExtractSuccessResponse<typeof readSubeventReviewData>["absences"]
) {
  return absences.sort((a, b) => {
    if (a.status === "approved" || a.status === "denied") {
      if (b.status === "approved" || b.status === "denied") {
        // If both are approved or denied, no preference
        return 0;
      } else {
        // If a is approved/denied and b is pending, a should go after b
        return 1;
      }
    } else if (b.status === "approved" || b.status === "denied") {
      // If b is approved/denied and a is pending, b should go after a
      return -1;
    } else {
      // Both are pending
      if (a.justificationUrl !== null && b.justificationUrl !== null) {
        // Both have justificationUrl, no preference
        return 0;
      } else if (a.justificationUrl !== null) {
        // a has justificationUrl but b doesn't, a should go before b
        return -1;
      } else if (b.justificationUrl !== null) {
        // b has justificationUrl but a doesn't, b should go before a
        return 1;
      } else {
        // Neither have justificationUrl, no preference
        return 0;
      }
    }
  });
}
