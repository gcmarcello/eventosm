import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { InboxIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Avatar,
  Navbar,
  NavbarItem,
  NavbarLabel,
  NavbarDivider,
  NavbarSection,
  NavbarSpacer,
  Sidebar,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarBody,
  SidebarSection,
  StackedLayout,
  SidebarStackedLayout,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "odinkit/client";
import { DashboardNavbar } from "./DashboardNavbar";

export function DashboardLayout({
  children,
  sidebar,
  navbar = <DashboardNavbar />,
}: {
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  navbar?: React.ReactNode;
}) {
  return (
    <SidebarStackedLayout navbar={navbar} sidebar={sidebar}>
      {children}
    </SidebarStackedLayout>
  );
}
