"use client";
import clsx from "clsx";
import { BottomNavigation, Text, TabItem, For, Link, Alertbox } from "odinkit";
import { DisclosureAccordion } from "odinkit/client";

import { useContext, useRef } from "react";
import Image from "next/image";
import {
  CameraIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

import { useOrg } from "../../../_shared/components/OrgStore";
import RegistrationMobileButton from "./RegistrationMobileButton";
import { useSearchParams } from "next/navigation";
import { EventHeader } from "./EventHeader";
import { EventInfoSection } from "./EventInfoSection";
import { RegistrationButton } from "./RegistrationButton";
import { EventPageContext } from "../context/EventPage.ctx";

export default function EventContainer() {
  const { event, organization } = useContext(EventPageContext);
  const generalTabs: TabItem[] = [
    {
      content: (
        <div className="my-2 text-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: event.description || "Nenhuma descrição cadastrada.",
            }}
          />
        </div>
      ),
      title: "Descrição",
    },
    {
      content: (
        <div className="my-2 text-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: event.rules || "Nenhum regulamento cadastrado.",
            }}
          />
        </div>
      ),
      title: "Regulamento",
    },
  ];

  const params = useSearchParams();

  return (
    <>
      <div className={clsx("bg-slate-200", "xxl:mx-40 h-fit bg-cover")}>
        <div
          className={clsx("mb-4 rounded-b bg-zinc-50 shadow-md   lg:bg-white ")}
        >
          {params.get("registered") && (
            <Alertbox className="py-3 lg:mx-auto" type="error" dismissible>
              Você já está inscrito neste evento.
            </Alertbox>
          )}
          {params.get("registrationCompleted") && (
            <Alertbox className="py-3 lg:mx-auto" type="success" dismissible>
              Sua inscrição foi realizada com sucesso! Verifique seu email (
              {params.get("email")}) para mais informações e instruções de como
              acessar sua conta.
            </Alertbox>
          )}
          <div className="xs:pt-0 mb-3 flex flex-col justify-center gap-2 lg:mb-0 lg:me-5 lg:flex-row lg:gap-8  lg:pt-0">
            <div className="relative h-[50vh] w-full">
              <Image
                alt="Capa do Evento"
                src={event?.imageUrl || ""}
                fill
                className=""
              />
            </div>

            <div className="flex w-full  flex-col items-start gap-1  px-3 pt-1 lg:mt-5  lg:px-0">
              <EventHeader />

              <EventInfoSection />

              <RegistrationButton />

              <div className="xxl:flex-row xxl:items-center xxl:border-none xxl:pt-0 my-2 flex w-full flex-col gap-2 border-t border-zinc-200 pt-2">
                <Text className="font-medium">Mais Informações:</Text>
                <Link
                  href={`/resultados/${event.id}`}
                  className="text-sm hover:underline"
                  style={{
                    color:
                      event.status === "published"
                        ? "gray"
                        : organization.options.colors.primaryColor.hex,
                  }}
                >
                  <div className="flex gap-1">
                    <ClipboardDocumentListIcon className="size-5" />
                    Resultados{" "}
                  </div>
                </Link>

                <Link
                  href="#"
                  className="text-sm hover:underline"
                  style={{
                    color:
                      event.status === "published"
                        ? "gray"
                        : organization.options.colors.primaryColor.hex,
                  }}
                >
                  <div className="flex gap-1">
                    <CameraIcon className="size-5" />
                    Fotos e Vídeos{" "}
                    {event.status === "published" ? "(Em Breve)" : ""}
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 px-1 pb-20 lg:px-5 lg:pb-4">
            <div className={clsx("col-span-4 px-2 lg:px-0 lg:pe-5")}>
              <For each={generalTabs}>
                {(tab: TabItem, index: number) => (
                  <DisclosureAccordion defaultOpen={!index} title={tab.title}>
                    {tab.content}
                  </DisclosureAccordion>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation className="lg:hidden">
        <RegistrationMobileButton />
      </BottomNavigation>
    </>
  );
}
