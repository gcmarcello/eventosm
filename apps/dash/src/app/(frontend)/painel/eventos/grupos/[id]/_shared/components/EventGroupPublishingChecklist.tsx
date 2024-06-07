import { XMarkIcon } from "@heroicons/react/20/solid";
import { Text } from "odinkit";
import { EventGroupWithInfo } from "prisma/types/Events";

export function EventGroupPublishingChecklist({
  eventGroup,
}: {
  eventGroup: EventGroupWithInfo;
}) {
  if (
    eventGroup.Event.length &&
    eventGroup.EventModality.length &&
    eventGroup.EventModality.some(
      (modality) => modality.modalityCategory?.length
    ) &&
    eventGroup.EventRegistrationBatch.length
  )
    return null;
  return (
    <div className="mt-2 space-y-1 rounded-md p-2 dark:bg-zinc-50 dark:bg-opacity-10">
      {eventGroup.Event.length === 0 && (
        <Text className="flex items-center gap-1 text-xs">
          <XMarkIcon className="size-5 text-red-600" /> Nenhuma etapa foi
          criada.
        </Text>
      )}
      {eventGroup.EventModality.length === 0 && (
        <Text className="flex items-center gap-1 text-xs">
          <XMarkIcon className="size-5 text-red-600" />
          Nenhuma modalidade foi cadastrada.
        </Text>
      )}
      {eventGroup.EventModality.every(
        (modality) => !modality.modalityCategory?.length
      ) && (
        <Text className="flex items-center gap-1 text-xs">
          <XMarkIcon className="size-5 text-red-600" />
          Nenhuma modalidade tem uma categoria.
        </Text>
      )}
      {!eventGroup.EventRegistrationBatch.length && (
        <Text className="flex items-center gap-1 text-xs">
          <XMarkIcon className="size-5 text-red-600" />
          Nenhum lote de inscrições foi criado.
        </Text>
      )}
    </div>
  );
}
