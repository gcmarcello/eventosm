"use client";

import * as Headless from "@headlessui/react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  UserIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  Avatar,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "odinkit/client";
import React, { useState } from "react";

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function TeamDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href="/teams/1/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/1">
        <Avatar slot="icon" src="/tailwind-logo.svg" />
        <DropdownLabel>Tailwind Labs</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/teams/2">
        <Avatar
          slot="icon"
          initials="WC"
          className="bg-purple-500 text-white "
        />
        <DropdownLabel>Workcation</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="/teams/create">
        <PlusIcon />
        <DropdownLabel>New team&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

const navItems = [
  { label: "Home", url: "/painel/" },
  { label: "Eventos", url: "/painel/eventos" },
  { label: "Notícias", url: "/painel/noticias" },
  { label: "Usuários", url: "/painel/usuarios" },
  { label: "Galerias", url: "/painel/galerias" },
];

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Transition show={open}>
      <Headless.Dialog onClose={close} className="lg:hidden">
        <Headless.TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Headless.TransitionChild>
        <Headless.TransitionChild
          enter="ease-in-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Headless.DialogPanel className="fixed inset-y-0 w-full max-w-80 p-2 transition">
            <div className="flex h-full flex-col rounded-lg bg-white shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10">
              <div className="-mb-3 px-4 pt-3">
                <Headless.CloseButton
                  as={NavbarItem}
                  aria-label="Close navigation"
                >
                  <CloseMenuIcon />
                </Headless.CloseButton>
              </div>
              {children}
            </div>
          </Headless.DialogPanel>
        </Headless.TransitionChild>
      </Headless.Dialog>
    </Headless.Transition>
  );
}

export function DashboardLayout({
  sidebar,
  children,
}: React.PropsWithChildren<{
  sidebar?: React.ReactNode;
}>) {
  let [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="py-2.5 lg:hidden">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">
          <Navbar>
            <Dropdown>
              <DropdownButton as={NavbarItem} className="max-lg:hidden">
                <Avatar src="/tailwind-logo.svg" />
                <NavbarLabel>Tailwind Labs</NavbarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <TeamDropdownMenu />
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
        </div>
      </header>

      {/* Sidebar on mobile */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>

      {/* Content */}
      <main
        className={clsx("flex flex-1 pb-2", sidebar ? "lg:pe-2" : "lg:px-2")}
      >
        <div className="hidden lg:block">{sidebar}</div>
        <div className="grow p-6 lg:rounded-lg lg:bg-white lg:p-10 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
