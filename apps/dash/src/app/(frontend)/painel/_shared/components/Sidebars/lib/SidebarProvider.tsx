"use client";

import React, { useState } from "react";
import { SidebarContext } from "./sidebar.ctx";
import { User } from "@prisma/client";
import { OrganizationWithDomain } from "prisma/types/Organization";

export default function SidebarProvider({
  children,
  user,
  organization,
}: {
  children: React.ReactNode;
  user: Omit<User, "password">;
  organization: OrganizationWithDomain;
}) {
  const [visibility, setVisibility] = useState({
    panelTopbar: true,
    panelSidebar: false,
  });

  return (
    <SidebarContext.Provider
      value={{
        user,
        organization,
        visibility,
        setVisibility,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
