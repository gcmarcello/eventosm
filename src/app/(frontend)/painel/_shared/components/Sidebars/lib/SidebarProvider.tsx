"use client";

import React, { useEffect, useState } from "react";
import { SidebarContext } from "./sidebar.ctx";
import { Prisma, User } from "@prisma/client";

export default function SidebarProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Omit<User, "password">;
}) {
  const [visibility, setVisibility] = useState({
    supporterSidebar: false,
    panelTopbar: true,
    panelSidebar: false,
  });

  return (
    <SidebarContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
