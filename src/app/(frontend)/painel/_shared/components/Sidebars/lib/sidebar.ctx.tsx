import { createContext } from "react";

import { UserWithoutPassword } from "prisma/types/User";

export class SidebarContextProps {
  user: UserWithoutPassword;
}

export const SidebarContext = createContext(new SidebarContextProps());
