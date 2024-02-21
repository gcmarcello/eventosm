import { createColumnHelper } from "@tanstack/react-table";

import { Table } from "odinkit";

export default function DefaultTable({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <Table
      data={[
        {
          name: "Joao",
          idade: 20,
        },
        {
          name: "Maria",
          idade: 20,
        },
        {
          name: "Jose",
          idade: 20,
        },
        {
          name: "Pedro",
          idade: 20,
        },
      ]}
      columns={(columnHelper) => [
        columnHelper.accessor("idade", {
          id: "name",
          header: "Nome",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
      ]}
    />
  );
}
