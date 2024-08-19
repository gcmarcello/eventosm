"use client";

import React, { useMemo } from "react";
import { PanelContext } from "./Panel.ctx";
import { JwtUserPayload, Organization } from "shared-types";
import { useAction } from "odinkit/client";
import { logout } from "@/app/api/auth/action";

export function PanelProvider({
  children,
  session,
  organizations,
}: {
  children: React.ReactNode;
  session: JwtUserPayload;
  organizations: Organization[];
}) {
  const activeOrg = useMemo(
    () => organizations.find((o) => o.id === session.activeOrg),
    [session]
  );
  const { trigger: logoutTrigger, isMutating: isLoggingOut } = useAction({
    action: logout,
    redirect: true,
  });
  return (
    <PanelContext.Provider
      value={{
        session,
        organizations,
        activeOrg,
        logoutTrigger,
        isLoggingOut,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}
