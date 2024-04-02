"use client";
import { Organization } from "@prisma/client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { For, Link } from "odinkit";
import { EventGroupWithEvents } from "prisma/types/Events";

const steps = [
  { name: "geral", title: "Informações Gerais", disabled: false },
  { name: "personalizacao", title: "Personalização", disabled: false },
  { name: "permissoes", title: "Permissões", disabled: false },
];

export function SettingsNavbar({
  organization,
}: {
  organization: Organization;
}) {
  const pathname = usePathname().split("/");
  const color = organization.options.colors.primaryColor.hex;
  return (
    <For each={steps}>
      {(step, index) => {
        const selected = pathname.includes(step.name ?? "");
        return (
          <Link
            href={`/painel/configuracoes/${step.name}`}
            style={{
              borderColor: selected ? color : "gray",
              color: selected ? color : "gray",
            }}
            className={clsx(
              "grow cursor-pointer border-t-4 px-3 py-4 text-sm font-medium duration-200 *:ring-0 hover:bg-zinc-50 focus:ring-0",
              step.disabled && "cursor-not-allowed opacity-50",
              index === 0
                ? "me-2 ms-1 lg:ms-0"
                : index === steps.length - 1
                  ? "me-1 ms-2 lg:me-0"
                  : "mx-2"
            )}
          >
            <div className="flex flex-col items-start">
              <div className="whitespace-nowrap text-nowrap">
                Passo {index + 1}
              </div>
              <div className="whitespace-nowrap text-nowrap text-sm font-medium text-black">
                {step.title}
              </div>
            </div>
          </Link>
        );
      }}
    </For>
  );
}
