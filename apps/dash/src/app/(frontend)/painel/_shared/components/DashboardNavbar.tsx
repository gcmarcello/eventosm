"use client";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  UserIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  CalendarIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Organization } from "@prisma/client";
import {
  Navbar,
  NavbarItem,
  Avatar,
  NavbarLabel,
  NavbarDivider,
  NavbarSection,
  NavbarSpacer,
  For,
  OpenMenuIcon,
  MobileSidebar,
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
  DropdownHeading,
  DropdownSection,
} from "odinkit/client";
import { useState } from "react";

const navItems = [
  { label: "Home", url: "/painel", icon: HomeIcon },
  { label: "Eventos", url: "/painel/eventos", icon: CalendarIcon },
  { label: "Notícias", url: "/painel/notícias", icon: NewspaperIcon },
  { label: "Usuários", url: "/painel/usuários", icon: UserIcon },
  { label: "Galerias", url: "/painel/galerias", icon: PhotoIcon },
];

function TeamDropdownMenu({
  organizations,
}: {
  organizations: Organization[];
}) {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/painel/configuracoes/geral">
        <Cog8ToothIcon />
        <DropdownLabel>Configurações</DropdownLabel>
      </DropdownItem>
      {organizations.length ? <DropdownDivider /> : null}
      <DropdownSection>
        <DropdownHeading>Suas Organizações</DropdownHeading>
        <For each={organizations}>
          {(org) => (
            <DropdownItem>
              <Avatar src={org.options.images?.logo} />
              <DropdownLabel>{org.name}</DropdownLabel>
            </DropdownItem>
          )}
        </For>
      </DropdownSection>

      <DropdownDivider />
      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>Criar nova&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function DashboardNavbar({
  organizations,
  activeOrgId,
}: {
  organizations: Organization[];
  activeOrgId: string;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const activeOrg = organizations.find((org) => org.id === activeOrgId);

  return (
    <>
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar src={activeOrg?.options.images?.logo} />
                <SidebarLabel>{activeOrg?.name}</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <TeamDropdownMenu
                organizations={organizations.filter(
                  (org) => org.id !== activeOrgId
                )}
              />
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url, icon: Icon }) => (
                <SidebarItem key={label} href={url}>
                  <Icon />

                  <SidebarLabel>{label}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      </MobileSidebar>
      <Navbar>
        <NavbarItem
          onClick={() => setShowSidebar(true)}
          aria-label="Open navigation"
        >
          <OpenMenuIcon />
        </NavbarItem>
        <Dropdown>
          <DropdownButton as={NavbarItem} className="max-lg:hidden">
            <Avatar src={activeOrg?.options.images?.logo} />
            <NavbarLabel>{activeOrg?.name}</NavbarLabel>
            <ChevronDownIcon />
          </DropdownButton>
          <TeamDropdownMenu
            organizations={organizations.filter(
              (org) => org.id !== activeOrgId
            )}
          />
        </Dropdown>
        <NavbarDivider className="max-lg:hidden" />
        <NavbarSection className="max-lg:hidden">
          {navItems.map(({ label, url }) => (
            <NavbarItem key={label} href={url}>
              {label}
            </NavbarItem>
          ))}
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href="/search" aria-label="Search">
            <MagnifyingGlassIcon />
          </NavbarItem>
          <NavbarItem href="/inbox" aria-label="Inbox">
            <InboxIcon />
          </NavbarItem>
          <Dropdown>
            <DropdownButton as={NavbarItem}>
              <Avatar src="/profile-photo.jpg" square />
            </DropdownButton>
            <DropdownMenu className="min-w-64" anchor="bottom end">
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
        </NavbarSection>
      </Navbar>
    </>
  );
}
