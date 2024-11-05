import { createOrgTicketDto } from "@/app/api/contact/dto";
import { SubmitButton, Title } from "odinkit";
import { Form, Textarea, useForm } from "odinkit/client";
import { useMemo } from "react";
import { TicketForm } from "./form";
import prisma from "prisma/prisma";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
    },
  });

  if (!organization || !organization.options.pages?.contact) return notFound();

  return (
    <div className="bg-slate-200 lg:h-[calc(100dvh-80px)]">
      <div className="rounded-b-md bg-white px-4 pt-8 lg:mx-64 lg:px-16">
        <Title>Contato</Title>

        <div className="my-4 grid gap-4 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-2">
            <p className="text-sm">
              A Ouvidoria da {organization.name} – {organization.name} é o canal
              de comunicação e relacionamento direto com Atletas e a Sociedade
              Civil.
            </p>

            <p className="text-sm">
              A Ouvidoria da {organization.name} reflete a sua administração
              transparente, tendo como objetivo contribuir para uma melhoria
              continua dos serviços prestados, bem como, atender os anseios dos
              órgãos públicos e da sociedade. É um órgão de natureza mediadora,
              sem caráter deliberativo.
            </p>
            <p className="text-sm">
              A Ouvidoria realiza atendimento eletrônico, via e-mail e/ou por
              telefone. A {organization.name} não desconsidera demandas
              anônimas, mas recomenda que as solicitações enviadas seja de forma
              clara e objetiva.
            </p>
          </div>
          <div>
            <TicketForm organizationId={organization.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
