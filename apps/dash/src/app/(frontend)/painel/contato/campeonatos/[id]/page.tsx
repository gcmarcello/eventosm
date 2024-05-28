import { notFound } from "next/navigation";
import { isUUID } from "odinkit";

export default async function EventGroupContactPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isUUID(params.id)) return notFound();
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
  });

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventGroupId: params.id },
    include: { user: true },
  });
  const uniqueModalities = Array.from(
    new Set(registrations.map((r) => r.modalityId))
  ).filter((m) => m);

  const uniqueCategories = Array.from(
    new Set(registrations.map((r) => r.categoryId))
  ).filter((c) => c);

  const modalities = await prisma.eventModality.findMany({
    where: { id: { in: uniqueModalities as string[] } },
  });

  const categories = await prisma.modalityCategory.findMany({
    where: { id: { in: uniqueCategories as string[] } },
  });

  const status = [
    { id: "active", name: "Ativo" },
    { id: "pending", name: "Pendente" },
    { id: "suspended", name: "Suspenso" },
    { id: "cancelled", name: "Cancelado" },
  ];

  return (
    <div>
      <h1>Contato - {eventGroup?.name}</h1>
      <p>
        Entre em contato conosco para mais informações sobre os campeonatos.
      </p>
      <h2>Participantes</h2>
      {status.map((s) => (
        <div key={s.id}>
          <input id={s.name} type="checkbox" />
          <label htmlFor={s.name}>{s.name}</label>
        </div>
      ))}
      <ul>
        {registrations.map((registration) => (
          <li key={registration.id}>
            {registration.user.fullName} - {registration.user.email} -{" "}
            {modalities.find((m) => m.id === registration.modalityId)?.name} -{" "}
            {categories.find((c) => c.id === registration.categoryId)?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
