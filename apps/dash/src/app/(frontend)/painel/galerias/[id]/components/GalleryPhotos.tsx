"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { GalleryPhoto } from "@prisma/client";
import { Table } from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  Date,
} from "odinkit/client";
import { useMemo } from "react";

export function GalleryPhotos({ photos }: { photos: GalleryPhoto[] }) {
  const albumMedias = useMemo(
    () =>
      photos.map(({ imageUrl }) => ({
        src: imageUrl,
        width: 20,
        height: 20,
      })),
    [photos]
  );
  return (
    <Table
      search={false}
      data={photos}
      columns={(columnHelper) => [
        columnHelper.accessor("imageUrl", {
          id: "photo",
          header: "Mídia",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => <img height={50} width={50} src={info.getValue()} />,
        }),
        columnHelper.accessor("createdAt", {
          id: "createdAt",
          header: "Enviado em",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => <Date date={info.getValue()} />,
        }),
        columnHelper.accessor("id", {
          id: "id",
          header: "Opções",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => (
            <Dropdown>
              <DropdownButton plain>
                <EllipsisVerticalIcon className="size-5 text-zinc-500" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem href={`/painel/galerias/${info.getValue()}`}>
                  Editar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }),
      ]}
    />
  );
}
