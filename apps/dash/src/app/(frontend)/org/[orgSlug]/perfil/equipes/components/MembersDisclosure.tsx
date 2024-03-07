"use client";

import { removeTeamMember } from "@/app/api/teams/action";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { User } from "@prisma/client";
import { info } from "console";
import { List, Table, formatPhone } from "odinkit";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  Button,
  DisclosureAccordion,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  showToast,
  useAction,
} from "odinkit/client";
import { useState } from "react";

export default function MembersDisclosure({
  members,
  teamId,
}: {
  members: User[];
  teamId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const { data, trigger, isMutating } = useAction({
    action: removeTeamMember,
    onError: (error) => {
      console.error(error);
      showToast({
        title: "Erro",
        message: error,
        variant: "error",
      });
    },
    onSuccess: () => {
      showToast({
        title: "Sucesso",
        message: "Atleta removido com sucesso",
        variant: "success",
      });
    },
  });

  function confirmRemoval() {
    if (!selectedMember) return;
    trigger({ teamId, userId: selectedMember.id });
    setIsOpen(false);
  }

  return (
    <DisclosureAccordion title="Ver Todos">
      <Alert open={isOpen} onClose={setIsOpen} size="lg">
        <AlertTitle>
          Você tem certeza que deseja remover {selectedMember?.fullName} da
          equipe?
        </AlertTitle>
        <AlertDescription>
          Você não poderá desfazer essa ação. As inscrições e pagamentos feitos
          por esse atleta serão mantidos.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          {selectedMember?.id && (
            <Button color="red" onClick={() => confirmRemoval()}>
              Remover
            </Button>
          )}
        </AlertActions>
      </Alert>
      <Table
        striped
        data={members}
        columns={(columnHelper) => [
          columnHelper.accessor("fullName", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("phone", {
            id: "phone",
            header: "Telefone",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => formatPhone(info.getValue()),
          }),
          columnHelper.accessor("id", {
            header: "Opções",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-700" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      setSelectedMember(info.row.original);
                      setIsOpen(true);
                    }}
                  >
                    <span className={"font-medium text-red-600"}>Remover</span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      />
    </DisclosureAccordion>
  );
}
