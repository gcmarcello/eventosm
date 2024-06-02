"use client";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Container, Heading, Text } from "odinkit";
import { Button } from "odinkit/client";
import { useState } from "react";
import NewOrganizationForm from "./NewOrganizationForm";
import { UserSession } from "@/middleware/functions/userSession.middleware";

interface CreateOrgContainerProps {
  user: UserSession;
}

export default function CreateOrgContainer(props: CreateOrgContainerProps) {
  const [screen, setScreen] = useState<"start" | "form">("start");

  if (screen === "start") {
    return (
      <div className="grid grid-cols-1 py-20 lg:grid-cols-6">
        <div className="col-span-full lg:col-span-2 lg:col-start-3">
          <Container className="mx-4 mt-4 lg:col-start-2 lg:mb-10">
            <div className="flex flex-col gap-6 px-8 py-6">
              <Heading>Criar uma nova organização</Heading>
              <Text>
                Para criar um evento, você precisa primeiro criar uma
                organização.
              </Text>
              <Text>
                Todos os eventos que você criar serão vinculados a ela, e você
                poderá customizar o perfil da maneira como desejar (adicionar
                fotos, vídeos, notícias, calendário de eventos, e muito mais!)
              </Text>

              <Button onClick={() => setScreen("form")} color="purple">
                <PlusIcon />
                Iniciar
              </Button>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (screen === "form") {
    return <NewOrganizationForm user={props.user} />;
  }
}
