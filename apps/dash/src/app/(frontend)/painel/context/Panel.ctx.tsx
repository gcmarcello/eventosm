import { createContext } from "react";
import { JwtUserPayload, Organization } from "shared-types";

export class PanelContextProps {
  organizations: Organization[];
  activeOrg?: Organization;
  session: JwtUserPayload;
  logoutTrigger: () => void;
  isLoggingOut: boolean;
}

export const PanelContext = createContext(new PanelContextProps());
