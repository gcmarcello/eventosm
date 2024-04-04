import { Event, EventGroup, EventModality } from "@prisma/client";
import { Alertbox, Text } from "odinkit";
import {
  EventGroupWithEvents,
  EventModalityWithCategories,
} from "prisma/types/Events";
import { EventRegistrationBatchesWithCategories } from "prisma/types/Registrations";
import { EventPublishingButton } from "./EventPublishingButton";

export default function EventPublishing({
  event,
  modalities,
  batches,
  canPublish,
}: {
  event: Event;
  modalities: EventModalityWithCategories[];
  batches: EventRegistrationBatchesWithCategories[];
  canPublish: boolean;
}) {
  return canPublish ? (
    <>
      <div className="flex items-center justify-between gap-2 lg:w-auto lg:justify-end ">
        {event.status === "draft" && (
          <Text className="text-sm">O evento já pode ser publicado!</Text>
        )}

        <EventPublishingButton event={event} />
      </div>
    </>
  ) : (
    <Alertbox
      type="error"
      title="Atenção! Seu evento ainda não pode ser publicado."
    >
      <ul className="list-disc space-y-1">
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
