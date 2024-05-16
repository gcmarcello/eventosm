import { EventModality } from "@prisma/client";
import { For, Heading } from "odinkit";
import { Button } from "odinkit/client";
import { Dispatch, SetStateAction } from "react";

export function ModalitySelection({
  modalities,
  setFilter,
}: {
  modalities: EventModality[];
  setFilter: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div className="my-2">
      <Heading>Modalidades</Heading>
      <div className="flex justify-between gap-4">
        <For each={modalities}>
          {(modality) => (
            <Button
              className={"flex-grow"}
              onClick={() => setFilter(modality.id)}
            >
              {modality.name}
            </Button>
          )}
        </For>
      </div>
    </div>
  );
}
