"use client";
import {
  EventResultsWithPosition,
  calculatePosition,
  sortPositions,
} from "@/utils/results";
import {
  EventGroup,
  EventGroupRules,
  EventModality,
  EventResult,
  Organization,
  Team,
} from "@prisma/client";
import { Table, LoadingSpinner, BottomNavigation } from "odinkit";
import {
  Button,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Select,
  useForm,
  useFormContext,
} from "odinkit/client";
import {
  EventGroupResultWithInfo,
  EventResultWithInfo,
} from "prisma/types/Results";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { format } from "path";
import { EventGroupWithInfo } from "prisma/types/Events";

export type Result = {
  POS: string;
  NUM: string;
  ATLETA: string;
  EQUIPE: string;
  CATEGORIA: string;
  TEMPO: string;
  RITMO: string;
};

export type GroupWithResults = {
  team: Team;
  score: number | null;
  position: number;
};

export function GroupResultsTable({
  results,
  eventGroup,
}: {
  results: GroupWithResults[];
  eventGroup?: EventGroup;
}) {
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

  return (
    <>
      <Table
        dense
        data={results}
        search={false}
        columns={(columnHelper) => [
          columnHelper.accessor("position", {
            id: "position",
            header: "Posição",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (info) => handlePlaces(info.getValue()),
          }),

          columnHelper.accessor("team.name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),

          columnHelper.accessor("score", {
            id: "time",
            enableColumnFilter: false,
            header: "Tempo",
            enableGlobalFilter: false,
            cell: (info) => millisecondsToTime(info.getValue()),
          }),
        ]}
      ></Table>
    </>
  );
}
