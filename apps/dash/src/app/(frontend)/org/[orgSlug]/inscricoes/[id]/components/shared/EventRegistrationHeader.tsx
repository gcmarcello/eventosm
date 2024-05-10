import { EventRegistrationBatch } from "@prisma/client";
import Image from "next/image";
import { Text } from "odinkit";
import { EventWithInfo } from "prisma/types/Events";

export default function EventRegistrationHeader({
  event,
  batch,
}: {
  event: EventWithInfo;
  batch: EventRegistrationBatch;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-2 ">
      <div>
        <div className="mt-4 text-xl font-medium lg:mt-0"> {event.name}</div>
        <Text>Inscrição para o evento.</Text>
        {batch.name && <Text>Lote {batch.name}</Text>}
      </div>
      <div className="relative h-20 w-32 ">
        <Image
          className="rounded-md"
          fill={true}
          src={event.imageUrl || ""}
          alt="imagem do campeonato"
        />
      </div>
    </div>
  );
}
