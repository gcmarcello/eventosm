import { Dispatch, SetStateAction, createContext } from "react";

import { UserWithoutPassword } from "prisma/types/User";
import { Organization } from "@prisma/client";

export class SidebarContextProps {
  user: UserWithoutPassword;
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
