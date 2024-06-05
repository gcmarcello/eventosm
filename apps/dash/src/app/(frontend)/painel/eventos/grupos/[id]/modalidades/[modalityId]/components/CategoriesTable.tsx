"use client";
import { ModalityCategory } from "@prisma/client";
import { For, Heading, Link, Table } from "odinkit";
import { Button, Form, Input, Label, Select, useAction } from "odinkit/client";
import { upsertEventModalityCategories } from "@/app/api/categories/action";
import { use, useContext, useMemo } from "react";
import { CategoryPageContext } from "@/app/(frontend)/painel/eventos/_shared/components/categories/context/CategoryPage.ctx";
import { useFieldArray } from "react-hook-form";
import { CategoriesForm } from "./CategoriesForm";

export function CategoriesTable({
  categories,
}: {
  categories: ModalityCategory[];
}) {
  const { categoryForm, showForm, setShowForm, eventGroup, modality } =
    useContext(CategoryPageContext);

  return (
    <>
      <Heading>Categorias - {modality.name}</Heading>
      <div className="flex gap-2">
        <Button onClick={() => setShowForm((prev) => !prev)}>
          Editar Categorias
        </Button>
        <Button
          href={`/painel/eventos/grupos/${eventGroup?.id}/modalidades`}
          plain
        >
          Voltar ao menu de modalidades
        </Button>
      </div>
      {showForm ? (
        <CategoriesForm />
      ) : (
        <Table
          data={categories}
          columns={(columnHelper) => [
            columnHelper.accessor("name", {
              id: "name",
              header: "Nome",
              enableSorting: true,
              enableGlobalFilter: true,
              enableColumnFilter: false,
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("gender", {
              id: "gender",
              header: "Sexo",
              enableSorting: true,
              enableGlobalFilter: true,
              enableColumnFilter: false,
              cell: (info) => {
                switch (info.getValue()) {
                  case "unisex":
                    return "Unissex";

                  case "male":
                    return "Masculino";

                  case "female":
                    return "Feminino";

                  default:
                    return "unisex";
                    break;
                }
              },
            }),
            columnHelper.accessor("minAge", {
              id: "minAge",
              header: "Idade Mínima",
              enableSorting: true,
              enableGlobalFilter: true,
              enableColumnFilter: false,
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("maxAge", {
              id: "maxAge",
              header: "Idade Máxima",
              enableSorting: true,
              enableGlobalFilter: true,
              enableColumnFilter: false,
              cell: (info) => info.getValue(),
            }),
          ]}
        />
      )}
    </>
  );
}
