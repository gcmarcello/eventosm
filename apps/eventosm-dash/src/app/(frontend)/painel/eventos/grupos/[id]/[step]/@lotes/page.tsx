import { ExtractSuccessResponse } from "odinkit";
import EventBatches from "../../../../_shared/EventBatches";
import { readEventGroups } from "@/app/api/events/action";

export function EventBatchesForm({
  modalities,
  eventGroup,
  batches,
}: {
  eventGroup: ExtractSuccessResponse<typeof readEventGroups>[0];
}) {
  return (
    <EventBatches
      modalities={modalities}
      eventGroup={eventGroup}
      batches={batches}
    />
  );
}
