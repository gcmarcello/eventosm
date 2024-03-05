import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import UsersPanelPageTable from "./components/UsersTable";

export default async function UsersPanelPage() {
  const users = await prisma.user.findMany({
    select: {
      password: false,
      fullName: true,
      email: true,
      id: true,
      document: true,
      phone: true,
      role: true,
      confirmed: true,
      updatedAt: true,
      createdAt: true,
      infoId: true,
      info: true,
    },
  });
  return (
    <div>
      <UsersPanelPageTable users={users} />
    </div>
  );
}
