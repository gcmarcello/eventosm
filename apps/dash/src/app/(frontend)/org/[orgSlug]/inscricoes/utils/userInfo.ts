import { TeamWithUsers } from "prisma/types/Teams";

export function fetchUserInfo(
  userId: string,
  teams: TeamWithUsers[],
  form: any
) {
  return teams
    ?.find((team) => form.getValues("teamId") === team.id)
    ?.User.find((u) => u.id === userId);
}
