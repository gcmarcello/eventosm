"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
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
  CalendarDaysIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ClipboardDocumentIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/20/solid";
import { AnimatePresence, easeOut, motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
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
  For,
  SidebarDivider,
  MobileSidebar,
  NavbarItem,
  NavbarLabel,
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
import { useEffect, useMemo, useRef, useState } from "react";

export function EventGroupSidebar({
  eventGroup,
}: {
  eventGroup: EventGroupWithEvents;
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
              <div className="max-w-[250px]">{eventGroup.name}</div>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Configurações Gerais</SidebarHeading>
            <SidebarItem
              current={currentPage === "geral"}
              href={`/painel/eventos/grupos/${eventGroup.id}/geral`}
            >
              <HomeIcon />
              <SidebarLabel>Informações do Evento</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "pagamento"}
              href={`/painel/eventos/grupos/${eventGroup.id}/pagamento`}
            >
              <HomeIcon />
              <SidebarLabel>Pagamento</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "etapas"}
              href={`/painel/eventos/etapas/${eventGroup.id}`}
            >
              <CalendarDaysIcon />
              <SidebarLabel>Etapas</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
          <SidebarSection>
            <SidebarHeading>Realização</SidebarHeading>
            <SidebarItem
              current={currentPage === "modalidades"}
              href={`/painel/eventos/grupos/${eventGroup.id}/modalidades`}
            >
              <UserGroupIcon />
              <SidebarLabel>Modalidades e Categorias</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "kits"}
              href={`/painel/eventos/grupos/${eventGroup.id}/kits`}
            >
              <ShoppingBagIcon />
              <SidebarLabel>Kits</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "lotes"}
              href={`/painel/eventos/grupos/${eventGroup.id}/lotes`}
            >
              <TicketIcon />
              <SidebarLabel>Lotes de Inscrição</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "inscritos"}
              href={`/painel/eventos/grupos/${eventGroup.id}/inscritos`}
            >
              <ClipboardDocumentIcon />
              <SidebarLabel>Inscrições</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSpacer />
          <SidebarSection>
            <SidebarItem href="/support">
              <QuestionMarkCircleIcon />
              <SidebarLabel>Suporte</SidebarLabel>
            </SidebarItem>
            {/* <SidebarItem href="/changelog">
<SparklesIcon />
<SidebarLabel>Changelog</SidebarLabel>
</SidebarItem> */}
          </SidebarSection>
        </SidebarBody>
        <SidebarFooter className="max-lg:hidden">
          <Dropdown>
            <DropdownButton as={SidebarItem}>
              <span className="flex min-w-0 items-center gap-3">
                <Avatar
                  src="/profile-photo.jpg"
                  className="size-10"
                  square
                  alt=""
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                    Erica
                  </span>
                  <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                    erica@example.com
                  </span>
                </span>
              </span>
              <ChevronUpIcon />
            </DropdownButton>
            <DropdownMenu className="min-w-64" anchor="top start">
              <DropdownItem href="/my-profile">
                <UserIcon />
                <DropdownLabel>My profile</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="/settings">
                <Cog8ToothIcon />
                <DropdownLabel>Settings</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem href="/privacy-policy">
                <ShieldCheckIcon />
                <DropdownLabel>Privacy policy</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="/share-feedback">
                <LightBulbIcon />
                <DropdownLabel>Share feedback</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem href="/logout">
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Sign out</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </SidebarFooter>
      </Sidebar>
    ),
    []
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
