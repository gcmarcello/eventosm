"use client";
import { For, Heading, Text } from "odinkit";
import { EventRegistration, Organization, Team } from "@prisma/client";
import EventGroupRegistrationCard from "./RegistrationModal/EventGroup/EventGroupRegistrationCard";
import { useEffect, useState } from "react";
import { EventGroupRegistrationModal } from "./RegistrationModal/EventGroup/EventGroupRegistrationModal";
import { EventRegistrationModal } from "./RegistrationModal/Event/EventRegistrationModal";
import EventRegistrationCard from "./RegistrationModal/Event/EventRegistrationCard";
import {
  EventGroupRegistrationWithInfo,
  EventRegistrationWithInfo,
} from "prisma/types/Registrations";
import { RegistrationModalProvider } from "./RegistrationModal/context/RegistrationModalProvider";

export default function RegistrationsContainer({
  registrations,
  organization,
  teams,
}: {
  registrations: (EventRegistrationWithInfo | EventGroupRegistrationWithInfo)[];
  organization: Organization;
  teams: Team[];
}) {
  const [modalInfo, setModalInfo] = useState<EventRegistrationWithInfo | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function handleModalOpen(registration: EventRegistrationWithInfo) {
    setModalInfo(registration);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading>Inscrições Ativas</Heading>
        {registrations.filter((reg) => reg.status === "active").length > 0 ? (
          <div className="mt-2 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <For each={registrations}>
              {(registration) => (
                <RegistrationModalProvider
                  teams={teams}
                  registration={registration}
                  organization={organization}
                >
                  {registration.eventGroupId ? (
                    <>
                      <EventGroupRegistrationCard />
                      <EventGroupRegistrationModal />
                    </>
                  ) : (
                    <>
                      <EventRegistrationCard />
                      <EventRegistrationModal />
                    </>
                  )}
                </RegistrationModalProvider>
              )}
            </For>
          </div>
        ) : (
          <Text>Nenhuma inscrição ativa.</Text>
        )}
      </div>
      <div>
        <Heading>Inscrições Pendentes</Heading>
        {registrations.filter((reg) => reg.status === "active").length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <For
              each={registrations.filter((reg) => reg.status === "pending")}
              fallback={<Text>Nenhuma inscrição pendente.</Text>}
            >
              {(registration) => {
                return (
                  <RegistrationModalProvider
                    teams={teams}
                    registration={registration}
                    organization={organization}
                  >
                    {registration.eventGroupId ? (
                      <EventGroupRegistrationCard />
                    ) : (
                      <EventRegistrationCard />
                    )}
                  </RegistrationModalProvider>
                );
              }}
            </For>
          </div>
        ) : (
          <Text>Nenhuma inscrição pendente.</Text>
        )}
      </div>
    </div>
  );
}
