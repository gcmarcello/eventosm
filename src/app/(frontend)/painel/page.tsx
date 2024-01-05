import { readOrganizations } from "@/app/api/orgs/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { Container } from "../_shared/components/Containers";
import { Text } from "../_shared/components/Text";
import { Button } from "../_shared/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import CreateOrgContainer from "../novaorg/components/CreateOrgContainer";
import { cookies } from "next/headers";
import SelectOrgContainer from "./components/SelectOrgContainer";
import { Organization } from "@prisma/client";

export default async function PanelPage() {
  return "xd";
}
