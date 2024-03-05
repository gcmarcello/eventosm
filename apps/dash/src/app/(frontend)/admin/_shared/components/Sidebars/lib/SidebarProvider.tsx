"use client";

import React, { useEffect, useState } from "react";
import { SidebarContext } from "./sidebar.ctx";
import { Organization, Prisma, User } from "@prisma/client";

export default function SidebarProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Omit<User, "password">;
}) {
  const [visibility, setVisibility] = useState({
    panelTopbar: true,
    panelSidebar: false,
  });

  return (
    <SidebarContext.Provider
      value={{
        user,

        visibility,
        setVisibility,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
