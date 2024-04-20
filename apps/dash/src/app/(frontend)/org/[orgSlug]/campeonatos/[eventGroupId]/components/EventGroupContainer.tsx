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
  DisclosureAccordion,
  Date,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
} from "odinkit/client";
import { EventGroupWithInfo } from "prisma/types/Events";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import {
  Event,
  EventRegistration,
  EventRegistrationBatch,
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
import RegistrationMobileButton from "./RegistrationMobileButton";

import { NoSsrMap } from "./NoSSRLocationMap";
import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import InstagramIcon from "node_modules/odinkit/src/icons/InstagramIcon";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import { useOrg } from "../../../_shared/components/OrgStore";
import { Field } from "@headlessui/react";

export default function EventGroupContainer({
  eventGroup,
  isUserRegistered,
  batch,
  organization,
  nextBatch,
  registrationCount,
}: {
  isUserRegistered?: EventRegistration | null;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations | null;
  organization: Organization;
  nextBatch: EventRegistrationBatch | null;
  registrationCount: number;
}) {
  const generalTabs: TabItem[] = [
    {
      content: (
        <div className="my-2 text-sm">
          <Table
            data={eventGroup.Event}
            pagination={false}
            search={false}
            columns={(columnHelper) => [
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => (
                  <span
                    className={
                      info.row.original.description
                        ? "cursor-pointer underline"
                        : ""
                    }
                    onClick={() =>
                      info.row.original.description &&
                      handleEventModal(info.row.original.id)
                    }
                  >
                    {info.getValue()}
                  </span>
                ),
              }),
              columnHelper.accessor("dateStart", {
                id: "dateStart",
                header: "Data",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => (
                  <Date date={info.getValue()} format="DD/MM/YYYY" />
                ),
              }),
              columnHelper.accessor("location", {
                meta: { className: "hidden lg:table-cell" },
                id: "location",
                header: "Local",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => info.getValue(),
              }),
              /* columnHelper.accessor("id", {
                id: "id",
                header: "",

                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) =>
                  eventGroup.Event.find((e) => e.id === info.getValue())
                    ?.description ? (
                    <Button
                      plain
                      type="button"
                      onClick={() => handleEventModal(info.getValue())}
                    >
                      Detalhes
                    </Button>
                  ) : (
                    "Informações em breve."
                  ),
              }), */
            ]}
          />
        </div>
      ),
      title: "Etapas",
    },
    {
      content: (
        <div className="my-2 text-sm">
          <div
            dangerouslySetInnerHTML={{
              __html: eventGroup.description || "Nenhuma descrição cadastrada.",
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
              __html: eventGroup.rules || "Nenhum regulamento cadastrado.",
            }}
          />
        </div>
      ),
      title: "Regulamento",
    },
  ];

  const { image } = useOrg();
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  function handleEventModal(id: string) {
    const event = eventGroup.Event.find((e) => e.id === id);
    if (!event) return;
    setSelectedEvent(event);
    setIsOpen(true);
  }

  return (
    <>
      <Dialog size="4xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>{selectedEvent?.name}</DialogTitle>
        {/* <DialogDescription>
          The refund will be reflected in the customer’s bank account 2 to 3
          business days after processing.
        </DialogDescription> */}
        <DialogBody className="mt-4">
          <div
            dangerouslySetInnerHTML={{
              __html: selectedEvent?.description || "Informações em breve.",
            }}
          ></div>
        </DialogBody>
        <DialogActions className="justify-between">
          <Button plain onClick={() => setIsOpen(false)}>
            Voltar
          </Button>
        </DialogActions>
      </Dialog>
      <div
        ref={contentRef}
        className={clsx(
          "rounded-b bg-zinc-50 shadow-md lg:mx-40  lg:mb-4  xl:mx-56"
        )}
      >
        <div className="xs:pt-0 mb-3 flex flex-col justify-center gap-2 lg:mb-0 lg:me-5 lg:flex-row lg:gap-8  lg:pt-0">
          <div className="relative h-[50vh] w-full">
            <Image
              alt="Capa do Evento"
              src={eventGroup?.imageUrl || ""}
              fill
              className=""
            />
          </div>

          <div className="flex w-full  flex-col items-start gap-1  px-3 pt-1 lg:mt-5  lg:px-0">
            <span className="text-base font-semibold text-gray-800 lg:text-2xl">
              <div className="flex items-center gap-2">
                {eventGroup.name}{" "}
                <Badge color="orange" className="my-auto">
                  Campeonato
                </Badge>
              </div>
            </span>
            <div className="mt-1 grid w-full grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3 ">
              <Text className="flex items-center gap-2 text-sm lg:text-start">
                <CalendarIcon
                  style={{
                    color: organization.options.colors.primaryColor.hex,
                  }}
                  className="size-4 lg:size-5"
                />
                {
                  <Date
                    date={eventGroup.Event[0]!.dateStart}
                    format="DD/MM/YYYY"
                  />
                }{" "}
                -{" "}
                {
                  <Date
                    date={
                      eventGroup.Event[eventGroup.Event.length - 1]
                        ?.dateEnd as any
                    }
                    format="DD/MM/YYYY"
                  />
                }
              </Text>

              <Text className="flex items-center gap-2 text-sm lg:text-start">
                <TrophyIcon
                  style={{
                    color: organization.options.colors.primaryColor.hex,
                  }}
                  className="size-4 lg:size-5"
                />
                {eventGroup.EventModality.length > 1
                  ? `${eventGroup.EventModality.length} Modalidades`
                  : `Modalidade ${eventGroup.EventModality[0]?.name}`}
              </Text>

              <div className="col-span-2 flex grid-cols-2 justify-between lg:grid ">
                <Text className="flex items-center gap-2 text-sm lg:text-start">
                  <MapPinIcon
                    style={{
                      color: organization.options.colors.primaryColor.hex,
                    }}
                    className="size-4 lg:size-5"
                  />
                  {`${eventGroup.location}`}
                </Text>
                <div className="flex gap-2">
                  <Text className="hidden lg:block">Compartilhe!</Text>
                  <Link
                    target="_blank"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${eventGroup.slug}`)}`}
                  >
                    <FacebookIcon size={22} />
                  </Link>
                  <Link
                    target="_blank"
                    href={`https://twitter.com/intent/tweet?text=Olha+esse+evento%3A+${encodeURIComponent(eventGroup.name)}+Acesse+no+link%3A++${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${eventGroup.slug}`)}`}
                  >
                    <XIcon size={22} />
                  </Link>
                  <Link
                    target="_blank"
                    href={`https://api.whatsapp.com/send?text=Olha+esse+evento%3A+${encodeURIComponent(eventGroup.name)}+Acesse+no+link%3A++${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL}/campeonatos/${eventGroup.slug}`)}`}
                  >
                    <WhatsappIcon size={23} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-3 hidden w-full rounded-md border border-zinc-100 p-3 lg:block">
              <div className="text-sm font-medium">Inscrições</div>
              <div className="my-2 space-y-2">
                {isUserRegistered?.status === "active" && (
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

                {isUserRegistered?.status === "suspended" ? (
                  <>
                    <Button disabled className={"w-full"} color={"rose"}>
                      Inscrição Suspensa
                    </Button>
                  </>
                ) : !isUserRegistered && batch ? (
                  batch.maxRegistrations <= batch._count.EventRegistration &&
                  !nextBatch ? (
                    <Button disabled color="red" className={"w-full"}>
                      Inscrições Esgotadas
                    </Button>
                  ) : (
                    <div className="flex justify-between gap-5 pt-2">
                      {batch.registrationType !== "team" && (
                        <Button
                          href={`/inscricoes/campeonatos/${eventGroup.id}`}
                          className={"grow"}
                          color={
                            organization.options.colors.primaryColor.tw.color
                          }
                        >
                          <UserCircleIcon
                            color={organization.options.colors.primaryColor.hex}
                            className="size-6"
                          />
                          Inscrição Individual
                        </Button>
                      )}
                      {batch.registrationType !== "individual" && (
                        <Button
                          href={`/inscricoes/campeonatos/${eventGroup.id}?team=true`}
                          className={"grow"}
                          color={
                            organization.options.colors.secondaryColor.tw.color
                          }
                        >
                          <UserGroupIcon
                            color={organization.options.colors.primaryColor.hex}
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
                ) : (
                  <Button className={"w-full"} disabled color="rose">
                    Inscrições Indisponíveis
                  </Button>
                )}
              </div>
            </div>

            <div className="xxl:flex-row xxl:items-center xxl:border-none xxl:pt-0 my-2 flex w-full flex-col gap-2 border-t border-zinc-200 pt-2">
              <Text className="font-medium">Mais Informações:</Text>
              <Link
                href={`/resultados/campeonatos/${eventGroup.id}`}
                className="text-sm hover:underline"
                style={{
                  color:
                    eventGroup.status === "published"
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
                    eventGroup.status === "published"
                      ? "gray"
                      : organization.options.colors.primaryColor.hex,
                }}
              >
                <div className="flex gap-1">
                  <CameraIcon className="size-5" />
                  Fotos e Vídeos{" "}
                  {eventGroup.status === "published" ? "(Em Breve)" : ""}
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
      <BottomNavigation className="lg:hidden">
        <RegistrationMobileButton
          organization={organization}
          batch={batch}
          nextBatch={nextBatch}
          isUserRegistered={isUserRegistered}
          registrationCount={registrationCount}
          eventGroup={eventGroup}
        />
      </BottomNavigation>
    </>
  );
}
