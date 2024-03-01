"use client";
import { readOrganizations } from "@/app/api/orgs/service";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Organization } from "@prisma/client";
import { changeActiveOrganization } from "@/app/api/orgs/action";

import { BottomNavigation } from "../../../../_shared/components/BottomNavigation";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Avatar, Container, Text } from "odinkit";
import { Button, showToast, useAction } from "odinkit/client";

export default function SelectOrgContainer({
  organizations,
}: {
  organizations: Organization[];
}) {
  const { trigger: changeOrgTrigger, isMutating: isLoading } = useAction({
    action: changeActiveOrganization,
    redirect: true,
    onError: (error) => {
      showToast({ message: error, variant: "error", title: "Erro" });
    },
  });

  return (
    <div>
      <Link href="/">Voltar</Link>
      <div className="mx-6 grid grid-cols-1 py-6 lg:mx-0 lg:grid-cols-6">
        <div className="col-span-full lg:col-span-2 lg:col-start-3">
          <Text className="font-semibold">Escolher Organização</Text>
          {organizations?.map((org, index) => (
            <Container
              key={`org-${index}`}
              className="mt-4 cursor-pointer duration-500 hover:scale-105 lg:col-start-2 lg:mb-10"
            >
              <div
                onClick={() => changeOrgTrigger(org.id)}
                className="flex flex-col items-center justify-center gap-4 p-6 "
              >
                <Avatar
                  src={org.options.image}
                  className="size-32  text-indigo-600 shadow-lg"
                />
                <Text className="text-sm">{org.name}</Text>
              </div>
            </Container>
          ))}
          <Link href="/novaorg">
            <Container className="mt-4 cursor-pointer duration-500 hover:scale-105 lg:col-start-2 lg:mb-10">
              <div className="flex flex-col items-center justify-center gap-4 p-6 ">
                <PlusCircleIcon className="h-12 w-12 text-indigo-600" />
                <Text className="text-sm">Adicionar Organização</Text>
              </div>
            </Container>
          </Link>

          <BottomNavigation className="lg:hidden">
            <div className="flex justify-end p-2">
              <Button href="/novaorg" color="indigo">
                Criar Nova
              </Button>
            </div>
          </BottomNavigation>
        </div>
      </div>
    </div>
  );
}
