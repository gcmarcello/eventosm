"use client";
import { EventResultsWithPosition, sortPositions } from "@/utils/results";
import {
  EventGroup,
  EventGroupRules,
  EventResult,
  Organization,
} from "@prisma/client";
import { Table, LoadingSpinner } from "odinkit";
import {
  Button,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Select,
  useForm,
} from "odinkit/client";
import {
  EventGroupResultWithInfo,
  EventResultWithInfo,
} from "prisma/types/Results";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";

export type Result = {
  POS: string;
  NUM: string;
  ATLETA: string;
  EQUIPE: string;
  CATEGORIA: string;
  TEMPO: string;
  RITMO: string;
};

export function ResultsTable({
  results,
  eventGroup,
}: {
  results: EventResultWithInfo[] | EventGroupResultWithInfo[];
  eventGroup?: EventGroup & {
    Organization: Organization;
    EventGroupRules?: EventGroupRules | null;
  };
}) {
  const [calculatedResults, setCalculatedResults] = useState<
    EventResultsWithPosition[] | EventGroupResultWithInfo[] | null
  >(null);

  const handlePlaces = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-yellow-500 font-semibold text-black shadow-md">
            1
          </div>
        );
      case 2:
        return (
          <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-gray-500 font-semibold text-white shadow-md">
            2
          </div>
        );
      case 3:
        return (
          <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-yellow-700 font-semibold text-white shadow-md">
            3
          </div>
        );
      case 4:
        return (
          <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-blue-700 font-semibold text-white shadow-md">
            4
          </div>
        );
      case 5:
        return (
          <div className="mx-auto flex size-6 items-center justify-center rounded-full bg-blue-500 font-semibold text-white shadow-md">
            5
          </div>
        );

      default:
        return (
          <div className="semibold mx-auto flex size-6 items-center justify-center rounded-full ">
            {position}
          </div>
        );
    }
  };

  const uniqueCategories: string[] = useMemo(
    () =>
      Array.from(
        new Set(results.map((obj) => obj.Registration.category!.name))
      ).sort(),
    []
  );
  const uniqueTeams: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          results
            .filter((r) => r.Registration.team)
            .map((obj) => obj.Registration.team!.name)
        )
      ).sort(),
    []
  );

  const form = useForm({
    schema: z.object({
      categoryId: z.string().optional(),
      teamId: z.string().optional(),
    }),
  });

  const Field = useMemo(() => form.createField(), []);

  useEffect(() => {
    setCalculatedResults(sortPositions(results));
  }, []);

  function handleFilter(type: "category" | "team", value: any) {
    if (!value) return setCalculatedResults(sortPositions(results));
    if (value === "Geral FEM")
      return setCalculatedResults(
        sortPositions(
          results.filter(
            (obj) => obj.Registration.category?.gender === "female"
          )
        )
      );
    if (value === "Geral MASC")
      return setCalculatedResults(
        sortPositions(
          results.filter((obj) => obj.Registration.category?.gender === "male")
        )
      );
    setCalculatedResults(
      sortPositions(
        results.filter((obj) => obj.Registration[type]?.name === value)
      )
    );
  }

  function millisecondsToTime(milliseconds: number) {
    if (!milliseconds) return "";
    let hours = Math.floor(milliseconds / (1000 * 60 * 60));
    let minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    let millis = milliseconds % 1000;

    const strHours = String(hours).padStart(2, "0");
    const strMinutes = String(minutes).padStart(2, "0");
    const strSeconds = String(seconds).padStart(2, "0");
    const strMillis = millis ? String(millis).padStart(3, "0") : 0;

    return `${strHours}:${strMinutes}:${strSeconds}${strMillis ? `.${strMillis}` : ""}`;
  }

  function clearFilter() {
    form.reset({ categoryId: "", teamId: "" });
    setCalculatedResults(sortPositions(results));
  }
  return calculatedResults ? (
    <>
      <Form hform={form} className="mt-4 items-center gap-3">
        <Fieldset>
          <FieldGroup className="flex-row space-y-3 lg:flex lg:items-end lg:justify-between lg:gap-2 lg:space-y-0">
            <div className="gap-2 lg:flex">
              <Field name="categoryId">
                <Label>Filtrar por Categoria</Label>
                <Select
                  disabled={Boolean(form.watch("teamId"))}
                  data={[
                    { id: "Geral FEM" },
                    { id: "Geral MASC" },
                    ...uniqueCategories.map((c) => ({ id: c })),
                  ]}
                  displayValueKey="id"
                  onChange={(event: any) =>
                    handleFilter("category", event.target.value)
                  }
                />
              </Field>
              <Field name="teamId">
                <Label>Filtrar por Equipe</Label>
                <Select
                  disabled={Boolean(form.watch("categoryId"))}
                  data={uniqueTeams.map((t) => ({ id: t }))}
                  displayValueKey="id"
                  onChange={(event: any) =>
                    handleFilter("team", event.target.value)
                  }
                />
              </Field>
            </div>
            <div className="pb-1">
              <Button
                className={"my-auto  w-full lg:w-auto"}
                onClick={() => clearFilter()}
              >
                Limpar Filtros
              </Button>
            </div>
          </FieldGroup>
        </Fieldset>
      </Form>
      <Table
        data={calculatedResults}
        columns={(columnHelper) => [
          columnHelper.accessor("position", {
            id: "position",
            header: "Posição",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => handlePlaces(Number(info.getValue())),
          }),
          columnHelper.accessor("Registration.code", {
            id: "number",
            header: "Numero",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => Number(info.getValue()),
          }),
          columnHelper.accessor("Registration.user.fullName", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("Registration.category.name", {
            id: "category",
            header: "Categoria",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("Registration.team.name", {
            id: "team",
            header: "Equipe",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("score", {
            id: "time",
            header: eventGroup
              ? eventGroup.EventGroupRules?.scoreCalculation === "average"
                ? "Tempo Médio"
                : "Tempo Acumulado"
              : "Tempo",
            enableGlobalFilter: false,
            cell: (info) => millisecondsToTime(info.getValue()),
          }),
        ]}
      />
    </>
  ) : (
    <div className="flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
