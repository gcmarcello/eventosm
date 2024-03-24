import { EventGroup, EventModality } from "@prisma/client";
import { Alertbox, Text } from "odinkit";
import {
  EventGroupWithEvents,
  EventModalityWithCategories,
} from "prisma/types/Events";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { EventPublishingButton } from "../../[id]/_shared/components/EventPublishingButton";

export default function EventPublishing({
  eventGroup,
  modalities,
  batches,
  canPublish,
}: {
  eventGroup: EventGroupWithEvents;
  modalities: EventModalityWithCategories[];
  batches: EventRegistrationBatchesWithCategories[];
  canPublish: boolean;
}) {
  return canPublish ? (
    <>
      <div className="flex items-center justify-between gap-2 lg:w-auto lg:justify-end ">
        {eventGroup.status === "draft" && (
          <Text className="text-sm">O evento já pode ser publicado!</Text>
        )}

        <EventPublishingButton eventGroup={eventGroup} />
      </div>
    </>
  ) : (
    <Alertbox
      type="error"
      title="Atenção! Seu evento ainda não pode ser publicado."
    >
      <ul className="list-disc space-y-1">
        {eventGroup.Event.length === 0 && <li>Nenhuma etapa foi criada.</li>}
        {modalities.length === 0 && (
          <li>O evento ainda não possui nenhuma modalidade cadastrada.</li>
        )}
        {modalities.every((modality) => !modality.modalityCategory?.length) && (
          <li>Nenhuma modalidade tem uma categoria cadastrada.</li>
        )}
        {!batches.length && <li>Nenhum lote de inscrições foi criado.</li>}
      </ul>
    </Alertbox>
  );
}
