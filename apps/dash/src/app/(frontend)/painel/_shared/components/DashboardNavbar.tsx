"use client";
import { logout } from "@/app/api/auth/action";
import { changeActiveOrganization } from "@/app/api/orgs/action";
import { UserSession } from "@/middleware/functions/userSession.middleware";
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
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Organization } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
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
  LoadingSpinner,
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
  useAction,
  showToast,
} from "odinkit/client";
import { useState } from "react";
import { LoadingOverlay } from "./LoadingOverlay";

const navItems = [
  { label: "Home", url: "/painel", id: "painel", icon: HomeIcon },
  {
    label: "Eventos",
    url: "/painel/eventos",
    id: "eventos",
    icon: CalendarIcon,
  },
  {
    label: "Notícias",
    url: "/painel/noticias",
    id: "noticias",
    icon: NewspaperIcon,
  },
  {
    label: "Usuários",
    url: "/painel/usuarios",
    id: "usuarios",
    icon: UserIcon,
  },
  {
    label: "Galerias",
    url: "/painel/galerias",
    id: "galerias",
    icon: PhotoIcon,
  },
];

function TeamDropdownMenu({
  organizations,
}: {
  organizations: Organization[];
}) {
  const router = useRouter();
  const { trigger: changeOrgTrigger, isMutating: isOrgChanging } = useAction({
    action: changeActiveOrganization,
    redirect: true,
    onSuccess: () => {
      showToast({
        title: "Sucesso!",
        message: "Organização alterada com sucesso.",
        variant: "success",
      });
      router.push("/painel");
    },
    onError: () =>
      showToast({
        title: "Erro!",
        message: "Não foi possível trocar de organização.",
        variant: "error",
      }),
  });

  if (isOrgChanging) {
    return <LoadingOverlay />;
  }

  return (
    <DropdownMenu
      className="min-w-80 lg:min-w-64"
      anchor={{ to: "bottom start" }}
    >
      <DropdownItem href="/painel/configuracoes/geral">
        <Cog8ToothIcon />
        <DropdownLabel>Configurações</DropdownLabel>
      </DropdownItem>
      {organizations.length ? <DropdownDivider /> : null}
      <DropdownSection>
        <DropdownHeading>Suas Organizações</DropdownHeading>
        <For each={organizations}>
          {(org) => (
            <DropdownItem onClick={() => changeOrgTrigger(org.id)}>
              <Avatar src={org.options.images?.logo} />
              <DropdownLabel>{org.name}</DropdownLabel>
            </DropdownItem>
          )}
        </For>
      </DropdownSection>

      <DropdownDivider />
      <DropdownItem href="/novaorg">
        <PlusIcon />
        <DropdownLabel>Criar nova&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function DashboardNavbar({
  organizations,
  user,
  activeOrgId,
}: {
  organizations: Organization[];
  activeOrgId: string;
  user: UserSession;
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const activeOrg = organizations.find((org) => org.id === activeOrgId);
  const pathname = usePathname();
  const currentPage = pathname.split("/")[2] ?? "painel";

  const { trigger: logoutTrigger, isMutating: isLoggingOut } = useAction({
    action: logout,
    redirect: true,
    onError: () =>
      showToast({
        title: "Erro!",
        message: "Não foi possível efetuar o logout.",
        variant: "error",
      }),
  });

  if (isLoggingOut) {
    return <LoadingOverlay />;
  }

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
          className="block lg:hidden"
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
          {navItems.map(({ label, url, id }) => (
            <NavbarItem current={id === currentPage} key={label} href={url}>
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
              <UserCircleIcon /> {user.fullName.split(" ")[0]}
            </DropdownButton>
            <DropdownMenu className="min-w-64" anchor={{ to: "bottom end" }}>
              <DropdownItem href="/my-profile">
                <UserIcon />
                <DropdownLabel>Meu Perfil</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem href="/privacy-policy">
                <ShieldCheckIcon />
                <DropdownLabel>Política de Privacidade</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="/share-feedback">
                <LightBulbIcon />
                <DropdownLabel>Enviar Feedback</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={() => logoutTrigger("/login")}>
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
