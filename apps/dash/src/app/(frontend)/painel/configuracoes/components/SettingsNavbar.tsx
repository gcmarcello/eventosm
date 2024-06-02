"use client";

import {
  HomeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  TicketIcon,
  ClipboardDocumentIcon,
  QuestionMarkCircleIcon,
  ChevronUpIcon,
  UserIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  AdjustmentsHorizontalIcon,
  SwatchIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  IdentificationIcon,
  SparklesIcon,
} from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarSection,
  SidebarItem,
  SidebarBody,
  SidebarHeading,
  SidebarLabel,
  SidebarSpacer,
  SidebarFooter,
  Avatar,
  NavbarItem,
  NavbarLabel,
  MobileSidebar,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "odinkit/client";
import { EventGroupWithEvents } from "prisma/types/Events";
import { useMemo, useState } from "react";

export function OrgSettingsSidebar({
  organization,
}: {
  organization: Organization;
}) {
  const pathname = usePathname();
  const currentPage = useMemo(() => pathname.split("/").pop(), [pathname]);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebar = useMemo(
    () => (
      <Sidebar>
        <SidebarHeader>
          <SidebarSection className="max-lg:hidden">
            <SidebarItem>
              <div className="max-w-[250px]">Configurações da Organização</div>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Configurações Gerais</SidebarHeading>
            <SidebarItem
              current={currentPage === "geral"}
              href={`/painel/configuracoes/geral`}
            >
              <UserCircleIcon />
              <SidebarLabel>Perfil</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "personalizacao"}
              href={`/painel/configuracoes/personalizacao`}
            >
              <SwatchIcon />
              <SidebarLabel>Personalização</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "permissoes"}
              href={`/painel/configuracaoes/permissoes`}
              disabled
            >
              <IdentificationIcon />
              <SidebarLabel>Permissões</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSpacer />
        </SidebarBody>
        <SidebarFooter className="max-lg:hidden">
          <SidebarSection>
            <SidebarItem href="/support">
              <QuestionMarkCircleIcon />
              <SidebarLabel>Suporte</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/changelog">
              <SparklesIcon />
              <SidebarLabel>Changelog</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    ),
    [pathname]
  );

  return (
    <>
      <div className="sticky top-0 hidden lg:block">{sidebar}</div>{" "}
      <header className="flex items-center justify-end bg-zinc-200 px-4 lg:hidden dark:bg-zinc-500">
        <div className="py-2.5 lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <div className="flex w-full items-center gap-2">
              <NavbarLabel>Configurações da Organização</NavbarLabel>
              <span className="">
                <AdjustmentsHorizontalIcon className="size-5 text-zinc-500 dark:text-white" />
              </span>
            </div>
          </NavbarItem>
        </div>
      </header>
      <MobileSidebar
        open={showSidebar}
        close={() => setShowSidebar(false)}
        direction="right"
      >
        {sidebar}
      </MobileSidebar>
    </>
  );
}
