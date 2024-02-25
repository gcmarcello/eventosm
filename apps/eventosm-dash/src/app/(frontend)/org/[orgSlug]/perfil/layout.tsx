import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";

export default function OrgProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
