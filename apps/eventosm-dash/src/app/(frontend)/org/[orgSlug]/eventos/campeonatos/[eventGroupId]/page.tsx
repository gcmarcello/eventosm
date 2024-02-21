import { readEventGroups } from "@/app/api/events/service";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { notFound } from "next/navigation";
import { BottomNavigation, TabItem, Tabs, Text, isUUID } from "odinkit";
import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
} from "odinkit/client";
import { DisclosureAccordion } from "odinkit/client";
import { useOrg } from "../../../components/OrgStore";
import EventGroupContainer from "./components/EventGroupContainer";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { readRegistrations } from "@/app/api/registrations/service";
import { readActiveBatch } from "@/app/api/batches/service";

export default async function TorneioPage({
  params,
}: {
  params: { orgSlug: string; eventGroupId: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(OptionalUserSessionMiddleware);

  const isEventGroupUUID = isUUID(params.eventGroupId);

  const eventGroup = (
    await readEventGroups({
      where: isEventGroupUUID
        ? {
            id: params.eventGroupId,
            Organization: { slug: params.orgSlug },
          }
        : {
            slug: params.eventGroupId,
            Organization: { slug: params.orgSlug },
          },
    })
  )[0];

  if (!eventGroup) return notFound();

  const isUserRegistered = userSession?.id
    ? (
        await readRegistrations({
          where: {
            eventGroupId: eventGroup.id,
            userId: userSession?.id,
          },
        })
      ).length > 0
    : false;

  const batch = await readActiveBatch({
    where: { eventGroupId: eventGroup?.id },
  });

  return (
    <EventGroupContainer
      eventGroup={eventGroup}
      isUserRegistered={isUserRegistered}
      batch={batch}
    />
  );
}
