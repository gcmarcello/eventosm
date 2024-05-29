"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { EventRegistrationStatus } from "@prisma/client";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  useFormContext,
} from "odinkit/client";
import clsx from "clsx";
import { UpdateRegistrationDto } from "@/app/api/registrations/dto";

export default function RegistrationStatusDropdown() {
  function handleTextColor(status: EventRegistrationStatus) {
    switch (status) {
      case "active":
        return "text-green-500";
      case "pending":
        return "text-amber-500";
      case "cancelled":
        return "text-red-600";
      case "suspended":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  }

  function handleStatusName(status: EventRegistrationStatus) {
    switch (status) {
      case "active":
        return "Ativa";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      case "suspended":
        return "Suspensa";
      default:
        return "Desconhecido";
    }
  }

  const form = useFormContext<UpdateRegistrationDto>();

  return (
    <Dropdown>
      <DropdownButton outline>
        Status:{" "}
        <span className={clsx(handleTextColor(form.watch("status")))}>
          {handleStatusName(form.watch("status"))}
        </span>
        <ChevronDownIcon className="size-5" />
      </DropdownButton>
      <DropdownMenu>
        <DropdownItem disabled>
          {handleStatusName(form.watch("status"))}
        </DropdownItem>
        <DropdownDivider />
        {Object.values(EventRegistrationStatus)
          .sort()
          .map((status) => {
            if (status !== form.watch("status"))
              return (
                <DropdownItem
                  onClick={() => {
                    form.setValue("status", status);
                    form.setValue("additionalInfo.suspensionReason", undefined);
                  }}
                >
                  <span>{handleStatusName(status)}</span>
                </DropdownItem>
              );
          })}
      </DropdownMenu>
    </Dropdown>
  );
}
