"use client";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  BottomNavigation,
  Text,
  TabItem,
  For,
  date,
  Badge,
  Table,
  Link,
  Alertbox,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownDescription,
  Button,
  Date,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
  DisclosureAccordion,
} from "odinkit/client";
import { EventGroupWithInfo } from "prisma/types/Events";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import {
  Event,
  EventModality,
  EventRegistrationBatch,
  Gallery,
  Organization,
} from "@prisma/client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  MapPinIcon,
  QrCodeIcon,
  TrophyIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import InstagramIcon from "node_modules/odinkit/src/icons/InstagramIcon";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import { useOrg } from "../../../_shared/components/OrgStore";
import { Field } from "@headlessui/react";
import RegistrationMobileButton from "./RegistrationMobileButton";
import { useSearchParams } from "next/navigation";

export default function EventContainer({
  event,
  isUserRegistered,
  batch,
  organization,
  nextBatch,
  registrationCount,
}: {
  isUserRegistered: boolean;
  event: Event & { EventModality: EventModality[], Gallery?: Gallery[] };
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations | null;
  organization: Organization;
  nextBatch: EventRegistrationBatch | null;
  registrationCount: number;
}) {
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

  const { image } = useOrg();
  const params = useSearchParams();
  const contentRef = useRef(null);

  return (
    <>
      <div
        className={clsx(!image && "bg-slate-200", "xxl:mx-40 h-fit bg-cover")}
      >
        <div
          ref={contentRef}
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
              <div className=" flex w-full items-center justify-between gap-2 text-base font-semibold text-gray-800 lg:w-auto lg:text-2xl">
                <>{event.name} </>
                <Badge color="purple" className="my-auto">
                  Evento
                </Badge>
              </div>

              <div className="mt-1 grid w-full grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3 ">
                <Text className="flex items-center gap-2 text-sm lg:text-start">
                  <CalendarIcon
                    style={{
                      color: organization.options.colors.primaryColor.hex,
                    }}
                    className="size-4 lg:size-5"
                  />
                  {event.dateStart.toISOString() ===
                  event.dateEnd.toISOString() ? (
                    <>
                      <Date date={event.dateStart} format="DD/MM/YYYY" />
                    </>
                  ) : (
                    <>
                      <Date date={event.dateStart} format="DD/MM/YYYY" /> -{" "}
                      <Date date={event.dateEnd} format="DD/MM/YYYY" />
                    </>
                  )}
                </Text>

                <Text className="flex items-center gap-2 text-sm lg:text-start">
                  <TrophyIcon
                    style={{
                      color: organization.options.colors.primaryColor.hex,
                    }}
                    className="size-4 lg:size-5"
                  />
                  {event.EventModality.length > 1
                    ? `${event.EventModality.length} Modalidades`
                    : `Modalidade ${event.EventModality[0]?.name}`}
                </Text>

                <div className="col-span-2 flex grid-cols-2 justify-between lg:grid ">
                  <Text className="flex items-center gap-2 text-sm lg:text-start">
                    <MapPinIcon
                      style={{
                        color: organization.options.colors.primaryColor.hex,
                      }}
                      className="size-4 lg:size-5"
                    />
                    {`${event.location}`}
                  </Text>
                  <div className="flex gap-2">
                    <Link
                      target="_blank"
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${event.slug}`)}`}
                    >
                      <FacebookIcon size={22} />
                    </Link>
                    <Link
                      target="_blank"
                      href={`https://twitter.com/intent/tweet?text=Olha+esse+evento%3A+${encodeURIComponent(event.name)}+Acesse+no+link%3A++${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${event.slug}`)}`}
                    >
                      <XIcon size={22} />
                    </Link>
                    <Link
                      target="_blank"
                      href={`https://api.whatsapp.com/send?text=Olha+esse+evento%3A+${encodeURIComponent(event.name)}+Acesse+no+link%3A++${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${event.slug}`)}`}
                    >
                      <WhatsappIcon size={23} />
                    </Link>
                    <Text className="hidden lg:block">Compartilhe!</Text>
                  </div>
                </div>
              </div>
              <div className="mt-3 hidden w-full rounded-md border border-zinc-100 p-3 lg:block">
                <div className="text-sm font-medium">Inscrições</div>
                <div className="my-2 space-y-2">
                  {isUserRegistered && (
                    <Button
                      href={`/perfil`}
                      className={"w-full"}
                      color={organization.options.colors.primaryColor.tw.color}
                    >
                      <QrCodeIcon
                        color={organization.options.colors.primaryColor.hex}
                        className="size-6"
                      />
                      Ver QR Code
                    </Button>
                  )}
                  {!isUserRegistered && batch ? (
                    batch.maxRegistrations <= batch._count.EventRegistration &&
                    !nextBatch ? (
                      <Button disabled color="red" className={"w-full"}>
                        Inscrições Esgotadas
                      </Button>
                    ) : (
                      <div className="flex justify-between gap-5 pt-2">
                        {batch.registrationType !== "team" && (
                          <Button
                            href={`/inscricoes/${event.id}`}
                            className={"grow"}
                            color={
                              organization.options.colors.primaryColor.tw.color
                            }
                          >
                            <UserCircleIcon
                              color={
                                organization.options.colors.primaryColor.hex
                              }
                              className="size-6"
                            />
                            Inscrição Individual
                          </Button>
                        )}
                        {batch.registrationType !== "individual" && (
                          <Button
                            href={`/inscricoes/${event.id}?team=true`}
                            className={"grow"}
                            color={
                              organization.options.colors.secondaryColor.tw
                                .color
                            }
                          >
                            <UserGroupIcon
                              color={
                                organization.options.colors.primaryColor.hex
                              }
                              className="size-6"
                            />
                            Inscrição de Equipe
                          </Button>
                        )}
                      </div>
                    )
                  ) : nextBatch ? (
                    <Button className={"w-full"} disabled color="rose">
                      Inscrições em breve{" - "}
                      <Date
                        date={nextBatch.dateStart}
                        format="DD/MM/YYYY HH:mm"
                      />
                    </Button>
                  ) : isUserRegistered ? null : (
                    <Button className={"w-full"} disabled color="rose">
                      Inscrições Indisponíveis
                    </Button>
                  )}
                </div>
              </div>

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
                  href={
                    event.Gallery
                      ? `/galerias/${event.Gallery[0]?.id}`
                      : "#"
                  }
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
        <RegistrationMobileButton
          organization={organization}
          batch={batch}
          nextBatch={nextBatch}
          isUserRegistered={isUserRegistered}
          registrationCount={registrationCount}
          event={event}
        />
      </BottomNavigation>
    </>
  );
}
