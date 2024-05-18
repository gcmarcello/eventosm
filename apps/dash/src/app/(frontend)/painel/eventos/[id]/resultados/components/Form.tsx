"use client";
import { createEventResults } from "@/app/api/results/action";
import { createResultsDto } from "@/app/api/results/dto";
import { Event, EventGroup, Organization } from "@prisma/client";
import { Heading, SubmitButton, Table, Text, sheetToJson, z } from "odinkit";
import {
  FileDropArea,
  FileInput,
  Form,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { EventResultWithInfo } from "prisma/types/Results";
import { useMemo, useState } from "react";

const excelDataSchema = z.array(
  z.object({
    NUM: z.string(),
    TEMPO: z.string().optional(),
  })
);

export function ResultsForm({
  event,
  results,
  organization,
}: {
  event: Event;
  results: EventResultWithInfo[];
  organization: Organization;
}) {
  const form = useForm({
    schema: createResultsDto,
    defaultValues: { eventId: event.id },
  });

  const Field = useMemo(() => form.createField(), []);

  const { data, trigger, isMutating } = useAction({
    action: createEventResults,
    redirect: true,
    requestParser: (data) => {
      data.file = [];
      return data;
    },
    onSuccess: () => {
      showToast({
        message: "Resultados criados com sucesso!",
        title: "Sucesso!",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  return (
    <>
      <Heading>Resultados - {event.name}</Heading>
      {!results.length && (
        <Form hform={form} onSubmit={(data) => trigger(data)}>
          <Field name="file">
            <FileInput
              fileTypes={["xlsx", "xls"]}
              maxFiles={1}
              maxSize={1}
              validate={async (file) => {
                const sheetArrayBuffer = await file.arrayBuffer();

                const sheetJson = sheetToJson(sheetArrayBuffer);

                if (!sheetJson?.length) throw "Sua planilha não possui dados";

                form.setValue(
                  "athletes",
                  sheetJson.map((r) => ({
                    code: r.NUM!,
                    score: isNaN(Number(r.TEMPO)) ? undefined : Number(r.TEMPO),
                  }))
                );

                return false;
              }}
              onError={(error) => {
                console.log(error);
                if (typeof error === "string") {
                  showToast({
                    message: error,
                    title: "Erro",
                    variant: "error",
                  });
                }
              }}
            >
              <FileDropArea
                /* color={organization.options.colors.primaryColor.hex} */
                render={
                  form.watch("file")?.length ? (
                    <Text>
                      <span
                        /* style={{
                                color:
                                  organization.options.colors.primaryColor
                                    .hex,
                              }} */
                        className="font-semibold"
                      >
                        Arquivo:
                      </span>{" "}
                      {form.watch("file")?.[0].name}{" "}
                      <span
                        onClick={() => {
                          form.resetField("file");
                          form.resetField("athletes");
                        }}
                        className="cursor-pointer font-semibold "
                      >
                        Trocar
                      </span>
                    </Text>
                  ) : null
                }
              />
            </FileInput>
          </Field>
          <SubmitButton>Enviar</SubmitButton>
        </Form>
      )}
      {results.length ? (
        <Table
          data={results}
          columns={(columnHelper) => [
            columnHelper.accessor("Registration.code", {
              id: "code",
              header: "Número",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
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
              id: "score",
              header: "Tempo",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),
          ]}
        />
      ) : form.watch("athletes")?.length ? (
        <Table
          data={form.watch("athletes")}
          columns={(columnHelper) => [
            columnHelper.accessor("code", {
              id: "code",
              header: "Número",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),

            columnHelper.accessor("score", {
              id: "score",
              header: "Tempo",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),
          ]}
        />
      ) : null}
    </>
  );
}
