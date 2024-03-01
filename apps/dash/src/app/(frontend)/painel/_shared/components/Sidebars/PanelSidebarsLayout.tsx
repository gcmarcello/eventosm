"use client";
import { Organization, Prisma, User } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import { SupporterTopBar } from "./PanelTopbar";
import SidebarProvider from "./lib/SidebarProvider";

export function PanelSidebarsLayout({
  user,
  organization,
}: {
  user: Omit<User, "password">;
  organization: Organization;
}) {
  return (
    <SidebarProvider user={user} organization={organization}>
      <PanelSideBar />
      <SupporterTopBar />
    </SidebarProvider>
  );
}
