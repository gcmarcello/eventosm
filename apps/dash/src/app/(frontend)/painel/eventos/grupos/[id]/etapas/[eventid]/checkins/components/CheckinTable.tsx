"use client";
import { Table } from "odinkit";
import { CheckinWithInfo } from "../page";
import { Date } from "odinkit/client";
import SubeventHeading from "../../components/SubeventHeading";
import { EventGroup, Organization } from "@prisma/client";
import { EventGroupWithEvents } from "prisma/types/Events";

export default function CheckinTable({
  checkins,
}: {
  checkins: CheckinWithInfo[];
}) {
  return (
    <>
      <Table
        data={checkins}
        columns={(columnHelper) => [
          columnHelper.accessor("registration.user.fullName", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("createdAt", {
            id: "createdAt",
            header: "Realizado em",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) => (
              <Date date={info.getValue()} format="DD/MM/YYYY HH:mm" />
            ),
          }),
        ]}
      />
    </>
  );
}
