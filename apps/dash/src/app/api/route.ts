import dayjs from "dayjs";
import _ from "lodash";
import { prisma } from "/workspaces/eventosm/apps/dash/prisma/prisma";
import { NextResponse } from "next/server";
import { reverseTimeToSeconds } from "@/utils/results";
/* 
export async function GET() {
  const events = await prisma.event.findMany({
    where: { id: { not: "7cb9ba8f-8ee8-47a6-a98c-e53753693015" } },
  });

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventGroupId: "0135c540-502d-4192-af32-3c98d02b73a4" },
  });

  let arr = [];
  for (const ev of events) {
    for (const reg of registrations) {
      arr.push({
        eventId: ev.id,
        registrationId: reg.id,
        score: reverseTimeToSeconds(Math.random() * 2000),
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      });
    }
  }

  const data = await prisma.eventResult.createMany({ data: arr });

  return NextResponse.json(data);
} */
