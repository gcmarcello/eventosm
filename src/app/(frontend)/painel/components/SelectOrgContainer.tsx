"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { Container } from "@/app/(frontend)/_shared/components/Containers";
import { Text } from "@/app/(frontend)/_shared/components/Text";
import { readOrganizations } from "@/app/api/orgs/service";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Organization } from "@prisma/client";
import { Avatar } from "../../_shared/components/Avatar";
import { changeActiveOrganization } from "@/app/api/orgs/action";
import { useAction } from "../../_shared/hooks/useAction";
import { showToast } from "../../_shared/components/Toast";
import { BottomNavigation } from "../../_shared/components/BottomNavigation";
import { OrganizationWithOptions } from "prisma/types/Organization";

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
