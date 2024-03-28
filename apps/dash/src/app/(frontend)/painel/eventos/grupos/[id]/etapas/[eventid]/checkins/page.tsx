import { EventCheckIn } from "@prisma/client";
import CheckinTable from "./components/CheckinTable";
import { redirect } from "next/navigation";
import SubeventHeading from "../components/SubeventHeading";
import { Button } from "odinkit/client";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { isDev } from "@/utils/settings";
import { Link } from "odinkit";
import CopyToClipboard from "@/app/(frontend)/_shared/components/CopyToClipboard";

export type CheckinWithInfo = EventCheckIn & {
  registration: {
    user: { fullName: string };
    team: { name: string } | null;
    category: { name: string } | null;
    modality: { name: string } | null;
  };
};

export default async function CheckinPage({
  params,
}: {
  params: { eventid: string; id: string };
}) {
  const checkins = await prisma.eventCheckIn.findMany({
    where: { eventId: params.eventid },
    include: {
      registration: {
        include: {
          user: { select: { fullName: true } },
          team: { select: { name: true } },
          category: { select: { name: true } },
          modality: { select: { name: true } },
        },
      },
    },
  });

  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: {
      Event: {
        where: {
          id: params.eventid,
        },
      },
    },
  });
  const regCount = await prisma.eventRegistration.count({
    where: { eventGroupId: params.id, status: "active" },
  });
  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup?.organizationId },
    include: { OrgCustomDomain: true },
  });

  if (!eventGroup || !organization) return redirect("/painel/eventos");

  const stats = [
    {
      name: "Total de Check-ins",
      stat: (
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {checkins.length}
        </dd>
      ),
    },
    {
      name: "Check-ins/Inscritos",
      progress: ((checkins.length / regCount) * 100).toFixed(2) + "%",
      stat: (
        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {((checkins.length / regCount) * 100).toFixed(2) + "%"}
        </dd>
      ),
    },
    {
      name: "Check-in",
      stat: (
        <div className="flex items-center gap-3 font-semibold">
          <Link
            target="_blank"
            href={`${isDev ? "http" : "https"}://${organization.OrgCustomDomain[0]?.domain}/checkin/${params.eventid}`}
          >
            <Button color={organization.options.colors.primaryColor.tw.color}>
              Realizar Check-ins
            </Button>
          </Link>

          <CopyToClipboard
            str={`${isDev ? "http" : "https"}://${organization?.OrgCustomDomain[0]?.domain}/checkin/${params.eventid}`}
          >
            <div className="flex cursor-pointer gap-2 text-sm text-gray-600">
              <ClipboardDocumentIcon className="size-5" /> Copiar Link
            </div>
          </CopyToClipboard>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mt-3">
        <SubeventHeading
          organization={organization}
          eventGroupId={eventGroup.id}
        >
          Check-ins - {eventGroup.Event[0]?.name}
        </SubeventHeading>
      </div>
      <div>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="space-y-2 overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="flex flex-col justify-between gap-3 truncate text-sm font-medium text-gray-500 lg:flex-row">
                <div>{item.name}</div>
                {item.progress && (
                  <div className="my-auto max-w-[100px] grow overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full "
                      style={{
                        width: item.progress,
                        backgroundColor:
                          organization.options.colors.primaryColor.hex,
                      }}
                    />
                  </div>
                )}
              </dt>
              {item.stat}
            </div>
          ))}
        </dl>
      </div>

      <CheckinTable checkins={checkins} />
    </>
  );
}
