"use client";
import { For, Heading, Text } from "odinkit";
import { EventRegistration, Organization, Team } from "@prisma/client";
import EventGroupRegistrationCard from "./EventGroupRegistrationCard";
import { useEffect, useState } from "react";
import { EventGroupRegistrationModal } from "./EventGroupRegistrationModal";
import { EventRegistrationModal } from "./EventRegistrationModal";
import EventRegistrationCard from "./EventRegistrationCard";

export default function RegistrationsContainer({
  registrations,
  organization,
  teams,
}: {
  registrations: EventRegistration[];
  organization: Organization;
  teams: Team[];
}) {
  const [modalInfo, setModalInfo] = useState<EventRegistration | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  function handleModalOpen(registration: EventRegistration) {
    setModalInfo(registration);
    setModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading>Inscrições Ativas</Heading>
        {registrations.filter((reg) => reg.status === "active").length > 0 ? (
          <div className="mt-2 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <For
              each={registrations
                .filter((reg) => reg.status === "active")
                .sort(
                  (a, b) =>
                    a.createdAt.getMilliseconds() -
                    b.createdAt.getMilliseconds()
                )}
            >
              {(registration) => {
                if (registration.eventGroupId) {
                  return (
                    <EventGroupRegistrationCard
                      handleModalOpen={handleModalOpen}
                      registration={registration}
                    />
                  );
                }
                return (
                  <EventRegistrationCard
                    handleModalOpen={handleModalOpen}
                    registration={registration}
                  />
                );
              }}
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
                  <EventGroupRegistrationCard
                    handleModalOpen={handleModalOpen}
                    registration={registration}
                  />
                );
              }}
            </For>
          </div>
        ) : (
          <Text>Nenhuma inscrição pendente.</Text>
        )}
      </div>
      {modalInfo ? (
        modalInfo.eventGroupId ? (
          <EventGroupRegistrationModal
            organization={organization}
            teams={teams}
            registration={modalInfo}
            isOpen={modalOpen}
            setIsOpen={setModalOpen}
          />
        ) : (
          <EventRegistrationModal
            organization={organization}
            teams={teams}
            registration={modalInfo}
            isOpen={modalOpen}
            setIsOpen={setModalOpen}
          />
        )
      ) : null}
    </div>
  );
}
