"use client";
import { Table, date, formatPhone } from "odinkit";
import { CheckinWithInfo } from "../page";
import { Date } from "odinkit/client";
import dayjs from "dayjs";

export default function CheckinTable({
  checkins,
}: {
  checkins: CheckinWithInfo[];
}) {
  return (
    <>
      <Table
        data={checkins}
        xlsx={{
          fileName: `Checkins - ${date(dayjs().toDate(), "DD-MM-YYYY")}`,
          data:
            checkins?.map((checkin) => ({
              Nome: checkin.registration.user?.fullName,
              Telefone: formatPhone(checkin.registration.user?.phone),
              "Realizado em": dayjs(checkin.createdAt).format(
                "DD/MM/YYYY HH:mm"
              ),
              Kit: checkin.registration.addon?.name,
              "Opção do Kit": checkin.registration.addonOption,
            })) || [],
        }}
        columns={(columnHelper) => [
          columnHelper.accessor("registration.user.fullName", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("registration.user.phone", {
            id: "phone",
            header: "Telefone",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => formatPhone(info.getValue()),
          }),
          columnHelper.accessor("registration.addon.name", {
            id: "addon",
            header: "Kit",
            meta: { filterVariant: "select" },
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              info.getValue() && (
                <>
                  {info.getValue()}
                  {info.row.original.registration.addonOption ? (
                    <> - {info.row.original.registration.addonOption}</>
                  ) : null}
                </>
              ),
          }),
          columnHelper.accessor("createdAt", {
            id: "createdAt",
            header: "Realizado em",
            enableSorting: true,
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
