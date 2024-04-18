import { Dispatch, SetStateAction, createContext } from "react";

import { UserWithoutPassword } from "prisma/types/User";
import { OrganizationWithDomain } from "prisma/types/Organization";

export class SidebarContextProps {
  user: UserWithoutPassword;
  organization: OrganizationWithDomain;
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
