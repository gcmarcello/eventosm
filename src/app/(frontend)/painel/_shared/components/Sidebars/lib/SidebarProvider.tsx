"use client";

import React, { useEffect, useState } from "react";
import { SidebarContext } from "./sidebar.ctx";
import { Organization, Prisma, User } from "@prisma/client";
import { OrganizationWithOptions } from "prisma/types/Organization";

export default function SidebarProvider({
  children,
  user,
  organization,
}: {
  children: React.ReactNode;
  user: Omit<User, "password">;
  organization: OrganizationWithOptions;
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
