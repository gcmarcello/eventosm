"use client";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  Tabs,
  BottomNavigation,
  Text,
  TabItem,
  Table,
  date,
  For,
  Heading,
  List,
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
} from "odinkit/client";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useOrg } from "../../../../components/OrgStore";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventRegistrationBatch, Organization } from "@prisma/client";
import InstagramIcon from "node_modules/odinkit/src/icons/InstagramIcon";
import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";

export default function EventGroupContainer({
  eventGroup,
  isUserRegistered,
  batch,
  organization,
  nextBatch,
}: {
  isUserRegistered: boolean;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations | null;
  organization: Organization;
  nextBatch: EventRegistrationBatch | null;
}) {
  const generalTabs: TabItem[] = [
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
        <div className="my-2 ">
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
  const tabs: TabItem[] = [
    {
      content: (
        <div>
          <For each={generalTabs}>
            {(tab: TabItem, index: number) => (
              <DisclosureAccordion defaultOpen={!index} title={tab.title}>
                {tab.content}
              </DisclosureAccordion>
            )}
          </For>
        </div>
      ),
      title: "Informações",
    },
    {
      content: (
        <div className="p-4">
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
                cell: (info) => info.getValue(),
              }),
              columnHelper.accessor("dateStart", {
                id: "dateStart",
                header: "Data",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => date(info.getValue(), "DD/MM/YYYY"),
              }),
              columnHelper.accessor("location", {
                id: "location",
                header: "Local",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => info.getValue(),
              }),
            ]}
          />
        </div>
      ),
      title: "Etapas",
    },
    {
      content: <div className="p-4 text-sm">Resultados em breve.</div>,
      title: "Resultados",
    },
  ];

  const { slug, colors, image } = useOrg();
  const contentRef = useRef(null);
  /* const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContentHeight((entry.target as any).offsetHeight);
        }
      });

      if (contentRef.current) {
        resizeObserver.observe(contentRef.current);
      }

      // Cleanup function to unobserve the element on component unmount
      return () => {
        if (contentRef.current) {
          resizeObserver.unobserve(contentRef.current);
        }
      };
    }
  }, []); */

  return (
    <>
      <div
        /* style={{
          backgroundImage: image ? `url(${image})` : "",
          height:
            (window && window.innerHeight) > contentHeight
              ? "100dvh"
              : contentHeight, "100dvh",
        }} */
        className={clsx(!image && "bg-slate-200", "bg-cover, h-[100dvh]")}
      >
        <div
          ref={contentRef}
          className={clsx(
            "xxl:mx-96 xs:mx-16 mb-4 rounded-b bg-white shadow-md lg:mx-40"
          )}
        >
          <div className="grid grid-cols-4 gap-4 ">
            <div className="col-span-4 h-32 w-full lg:h-64">
              <img
                src={eventGroup?.imageUrl || ""}
                className="xs:block h-full w-full rounded-none object-fill"
              />
              <div className="-mt-7 flex w-full flex-col items-center justify-center gap-2 px-4 lg:flex-row lg:justify-between">
                <div className="flex flex-col items-center gap-4 lg:flex-row">
                  <div className="xs:pt-0 flex flex-col items-center justify-center gap-3 lg:flex-row lg:pt-0">
                    <img
                      src={eventGroup?.imageUrl || ""}
                      className="hidden h-32 w-32 rounded-full border-2 border-white object-fill lg:ms-4 lg:block"
                    />
                    <div className="mt-16 flex flex-col px-4 lg:mt-0 lg:px-0">
                      <span className="text-center text-2xl font-semibold">
                        {eventGroup.name}
                      </span>
                      <Text className="text-center lg:text-start">
                        {`${eventGroup.location} - ${eventGroup.Event.length} etapas`}
                      </Text>
                    </div>
                  </div>
                </div>
                <div className="me-4 hidden flex-col gap-2 lg:flex">
                  <div className=" text-sm font-medium">Compartilhe!</div>
                  <div className="flex justify-center gap-3">
                    {/* <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=%${encodeURIComponent("https://corridaderuacubatao.com.br/")}`}
                    >
                      <FacebookIcon size={32} />
                    </Link> */}
                    <Link
                      href={`https://wa.me/?text=${encodeURI("https://corridaderuacubatao.com.br/")}`}
                    >
                      <WhatsappIcon size={32} />
                    </Link>
                    {/* <Link
                      href={`https://twitter.com/intent/tweet?&url=${encodeURI("https://corridaderuacubatao.com.br/")}`}
                    >
                      <XIcon size={32} />
                    </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-32 grid grid-cols-4 px-1 pb-20 lg:divide-x  lg:px-5 lg:pb-4">
            <div
              className={clsx("col-span-4 px-2 lg:col-span-3 lg:px-0 lg:pe-5")}
            >
              <Tabs
                color={organization.options.colors.primaryColor.hex}
                tabs={tabs}
              />
            </div>
            <div
              className={clsx(
                "col-span-4 hidden lg:col-span-1 lg:block lg:ps-5"
              )}
            >
              {batch ? (
                <>
                  <Dropdown>
                    <DropdownButton
                      className={"w-full"}
                      color={
                        isUserRegistered
                          ? "amber"
                          : organization.options.colors.primaryColor.tw.color
                      }
                    >
                      {isUserRegistered ? "Inscrito!" : "Inscrição"}

                      <ChevronUpIcon className="size-5 lg:hidden" />
                      <ChevronDownIcon className=" size-5 lg:block" />
                    </DropdownButton>
                    <DropdownMenu>
                      {
                        <DropdownItem
                          disabled={
                            isUserRegistered ||
                            !(
                              batch.registrationType === "individual" ||
                              batch.registrationType === "mixed"
                            )
                          }
                          href={`/inscricoes/campeonatos/${eventGroup.id}`}
                        >
                          <DropdownLabel>
                            <span className="inline-flex gap-2">
                              <UserIcon className="h-5 w-5" />
                              Individual
                            </span>
                          </DropdownLabel>
                        </DropdownItem>
                      }
                      <DropdownSeparator />
                      {
                        <DropdownItem
                          href={`/inscricoes/campeonatos/${eventGroup.id}?team=true`}
                          disabled={
                            !(
                              batch.registrationType === "team" ||
                              batch.registrationType === "mixed"
                            )
                          }
                        >
                          <DropdownLabel>
                            <span className="inline-flex gap-2">
                              <UserGroupIcon className="h-5 w-5" />
                              Por Equipes
                            </span>
                          </DropdownLabel>
                          <DropdownDescription>
                            Inscreva toda a equipe de uma só vez.
                          </DropdownDescription>
                        </DropdownItem>
                      }
                    </DropdownMenu>
                  </Dropdown>
                </>
              ) : isUserRegistered ? (
                <Button disabled color="amber" className={"w-full"}>
                  Inscrito!
                </Button>
              ) : nextBatch ? (
                <Button disabled color="red" className={"w-full"}>
                  Inscrições à partir de{" "}
                  {dayjs(nextBatch.dateStart).format("DD/MM/YYYY")}
                </Button>
              ) : (
                <Button disabled color="red" className={"w-full"}>
                  Inscrições Indisponíveis
                </Button>
              )}
              <dl className="mt-2 divide-y divide-gray-100">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Local
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {eventGroup.location}
                  </dd>
                </div>
                {eventGroup.Event[0]?.dateStart && (
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Início
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {date(eventGroup.Event[0]?.dateStart, "DD/MM/YYYY")}
                    </dd>
                  </div>
                )}
                {eventGroup.Event[eventGroup.Event.length - 1]?.dateEnd && (
                  <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Fim
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {date(
                        eventGroup.Event[eventGroup.Event.length - 1]
                          ?.dateEnd as any,
                        "DD/MM/YYYY"
                      )}
                    </dd>
                  </div>
                )}
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Etapas
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {eventGroup.Event.length}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    {eventGroup.EventModality.map(
                      (modality) => modality.name
                    ).join(", ")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation className="lg:hidden">
        <div className="flex flex-row-reverse items-center justify-between p-2">
          <Dropdown>
            <DropdownButton color={isUserRegistered ? "amber" : "green"}>
              {isUserRegistered
                ? "Inscrito!"
                : "Inscrição (à partir de R$ 0,00)"}

              <ChevronUpIcon className="size-5 lg:hidden" />
            </DropdownButton>
            <DropdownMenu>
              <DropdownItem
                disabled={isUserRegistered}
                href={`/inscricoes/campeonatos/${eventGroup.id}`}
              >
                <DropdownLabel>
                  <span className="inline-flex gap-2">
                    <UserIcon className="h-5 w-5" />
                    Individual
                  </span>
                </DropdownLabel>
                {/* <DropdownDescription>
                Open the file in a new tab.
              </DropdownDescription> */}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                href={`/inscricoes/campeonatos/${eventGroup.id}?team=true`}
              >
                <DropdownLabel>
                  <span className="inline-flex gap-2">
                    <UserGroupIcon className="h-5 w-5" />
                    Por Equipes
                  </span>
                </DropdownLabel>
                <DropdownDescription>
                  Inscreva toda a equipe de uma só vez.
                </DropdownDescription>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </BottomNavigation>
    </>
  );
}
