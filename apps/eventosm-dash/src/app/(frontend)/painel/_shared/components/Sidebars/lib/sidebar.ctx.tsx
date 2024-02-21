import { Dispatch, SetStateAction, createContext } from "react";

import { UserWithoutPassword } from "prisma/types/User";
import { Organization } from "@prisma/client";
import { OrganizationWithOptions } from "prisma/types/Organization";

export class SidebarContextProps {
  user: UserWithoutPassword;
  organization: OrganizationWithOptions;
  visibility: {
    panelTopbar: boolean;
    panelSidebar: boolean;
  };
  setVisibility: Dispatch<
    SetStateAction<{
      panelTopbar: boolean;
      panelSidebar: boolean;
    }>
  >;
}

export const SidebarContext = createContext(new SidebarContextProps());
