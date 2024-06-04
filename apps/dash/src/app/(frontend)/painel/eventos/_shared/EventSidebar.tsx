"use client";
import {
  ChevronDownIcon,
  Cog8ToothIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  HomeIcon,
  Square2StackIcon,
  TicketIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ChevronUpIcon,
  UserIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  ClipboardDocumentIcon,
  ShoppingBagIcon,
  UserGroupIcon,
} from "@heroicons/react/20/solid";
import { Event } from "@prisma/client";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarItem,
  Avatar,
  SidebarLabel,
  SidebarSection,
  SidebarBody,
  SidebarHeading,
  SidebarSpacer,
  SidebarFooter,
  NavbarItem,
  NavbarLabel,
  MobileSidebar,
  For,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "odinkit/client";
import { EventWithInfo } from "prisma/types/Events";
import { useEffect, useMemo, useRef, useState } from "react";

const navigation = [
  { name: "Configurações Gerais", href: "geral", icon: HomeIcon },
  { name: "Pagamento", href: "pagamento", icon: HomeIcon },
  { name: "Etapas", href: "etapas", icon: CalendarDaysIcon },
  {
    name: "Modalidades e Categorias",
    href: "modalidades",
    icon: UserGroupIcon,
  },
  { name: "Kits", href: "kits", icon: ShoppingBagIcon },
  { name: "Lotes de Inscrição", href: "lotes", icon: TicketIcon },
  { name: "Inscrições", href: "inscritos", icon: ClipboardDocumentIcon },
  { name: "Suporte", href: "support", icon: QuestionMarkCircleIcon },
];

export function EventSidebar({ event }: { event: Event }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  const currentPage = useMemo(() => pathname.split("/").pop(), [pathname]);
  const sidebar = useMemo(
    () => (
      <Sidebar>
        <SidebarHeader>
          <SidebarSection className="max-lg:hidden">
            <SidebarItem>
              <div className="max-w-[250px]">{event.name}</div>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Configurações Gerais</SidebarHeading>
            <For each={navigation}>
              {(item) => (
                <SidebarItem
                  current={currentPage === item.href}
                  href={`/painel/eventos/grupos/${event.id}` + "/" + item.href}
                >
                  <HomeIcon />
                  <SidebarLabel>{item.name}</SidebarLabel>
                </SidebarItem>
              )}
            </For>
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
      <div className="sticky top-0 hidden lg:block">{sidebar}</div>
      <header className="flex items-center justify-end bg-zinc-200 px-4 lg:hidden dark:bg-zinc-500">
        <div className="py-2.5 lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <div className="flex w-full items-center gap-2">
              <NavbarLabel>Configurações do Evento</NavbarLabel>
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
