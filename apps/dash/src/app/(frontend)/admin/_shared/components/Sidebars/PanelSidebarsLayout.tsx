"use client";
import { Organization, Prisma, User } from "@prisma/client";
import PanelSideBar from "./PanelSidebar";
import { SupporterTopBar } from "./PanelTopbar";
import SidebarProvider from "./lib/SidebarProvider";

export function PanelSidebarsLayout({
  user,
}: {
  user: Omit<User, "password">;
}) {
  return (
    <SidebarProvider user={user}>
      <PanelSideBar />
      <SupporterTopBar />
    </SidebarProvider>
  );
}
