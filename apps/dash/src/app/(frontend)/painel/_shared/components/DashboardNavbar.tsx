"use client";
import {
  ChevronDownIcon,
  InboxIcon,
  UserIcon,
  Cog8ToothIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  HomeIcon,
  CalendarIcon,
  NewspaperIcon,
  PhotoIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Organization } from "shared-types";
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
import { useContext, useState } from "react";
import { LoadingOverlay } from "./LoadingOverlay";
import { PanelContext } from "../../context/Panel.ctx";
import { logout, updateActiveOrganization } from "@/app/api/auth/action";

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
  const { trigger: updateActiveOrg, isMutating: isOrgUpdating } = useAction({
    action: updateActiveOrganization,
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

  if (isOrgUpdating) {
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
            <DropdownItem onClick={() => updateActiveOrg(org.id)}>
              <Avatar src={org.options?.images?.logo} />
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

export function DashboardNavbar() {
  const {
    organizations,
    session: user,
    activeOrg,
    logoutTrigger,
  } = useContext(PanelContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  const currentPage = pathname.split("/")[2] ?? "painel";

  /* const { trigger: logoutTrigger, isMutating: isLoggingOut } = useAction({
    action: logout,
    redirect: true,
    onError: () =>
      showToast({
        title: "Erro!",
        message: "Não foi possível efetuar o logout.",
        variant: "error",
      }),
  }); */

  /* if (isLoggingOut) {
    return <LoadingOverlay />;
  } */

  return (
    <>
      {activeOrg && (
        <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
          <Sidebar>
            <SidebarHeader>
              <Dropdown>
                <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                  <Avatar src={activeOrg?.options?.images?.logo} />
                  <SidebarLabel>{activeOrg?.name}</SidebarLabel>
                  <ChevronDownIcon />
                </DropdownButton>
                <TeamDropdownMenu
                  organizations={organizations.filter(
                    (org) => org.id !== activeOrg?.id
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
      )}
      <Navbar>
        {activeOrg && (
          <NavbarItem
            className="block lg:hidden"
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        )}
        {activeOrg && (
          <>
            <Dropdown>
              <DropdownButton as={NavbarItem} className="max-lg:hidden">
                <Avatar src={activeOrg?.options?.images?.logo} />
                <NavbarLabel>{activeOrg?.name}</NavbarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <TeamDropdownMenu
                organizations={organizations.filter(
                  (org) => org.id !== activeOrg?.id
                )}
              />
            </Dropdown>
            <NavbarDivider className="max-lg:hidden" />
          </>
        )}

        <NavbarSection className="max-lg:hidden">
          {activeOrg &&
            navItems.map(({ label, url, id }) => (
              <NavbarItem current={id === currentPage} key={label} href={url}>
                {label}
              </NavbarItem>
            ))}
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection>
          <NavbarItem href="/inbox" aria-label="Inbox">
            <InboxIcon />
          </NavbarItem>
          <Dropdown>
            <DropdownButton as={NavbarItem}>
              <UserCircleIcon /> {user.name.split(" ")[0]}
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
              <DropdownItem onClick={() => logoutTrigger()}>
                <ArrowRightStartOnRectangleIcon />
                <DropdownLabel>Sair</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarSection>
      </Navbar>
    </>
  );
}
