"use client";
import { readOrganizations } from "@/app/api/orgs/service";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Organization } from "@prisma/client";
import { changeActiveOrganization } from "@/app/api/orgs/action";
import { OrganizationWithOptions } from "prisma/types/Organization";

import { BottomNavigation } from "../../_shared/components/BottomNavigation";
import { useAction } from "odinkit/hooks/useAction";
import { showToast } from "odinkit/components/Toast";
import { Text } from "odinkit/components/Text";
import { Container } from "odinkit/components/Containers";
import { Avatar } from "odinkit/components/Avatar";
import { Button } from "odinkit/components/Button";

export default function SelectOrgContainer({
  organizations,
}: {
  organizations: OrganizationWithOptions[];
}) {
  const { trigger: changeOrgTrigger, isMutating: isLoading } = useAction({
    action: changeActiveOrganization,
    redirect: true,
    onError: (error) => {
      showToast({ message: error, variant: "error", title: "Erro" });
    },
  });

  return (
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
                src={org.options?.logo}
                className="size-32  text-lime-400 shadow-lg"
                initials={org.name[0]}
              />
              <Text className="text-sm">{org.name}</Text>
            </div>
          </Container>
        ))}

        <BottomNavigation>
          <div className="flex justify-end p-2">
            <Button href="/novaorg" color="lime">
              Criar Nova
            </Button>
          </div>
        </BottomNavigation>
      </div>
    </div>
  );
}
