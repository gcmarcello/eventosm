import { CreateMultipleRegistrationsDto } from "@/app/api/registrations/dto";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid";
import {
  TableMock,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  For,
  TableCell,
  Text,
} from "odinkit";
import {
  Description,
  ErrorMessage,
  Input,
  Label,
  Switch,
  useFormContext,
} from "odinkit/client";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useMemo } from "react";
import { UseFieldArrayReturn } from "react-hook-form";

export function ConfirmationForm({
  fieldArray,
  eventGroup,
}: {
  eventGroup: EventGroupWithInfo;
  fieldArray: UseFieldArrayReturn<
    CreateMultipleRegistrationsDto,
    "teamMembers",
    "id"
  >;
}) {
  const { fields, append } = fieldArray;

  const form = useFormContext<CreateMultipleRegistrationsDto>();

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <ClipboardDocumentCheckIcon className="h-20 w-20 text-emerald-600" />
        <Text>Confirme os dados dos atletas e finalize a inscrição.</Text>
        <div className="grid grid-cols-4">
          <div className="col-span-4">
            <TableMock>
              <TableHead>
                <TableRow>
                  <TableHeader>Nome Completo</TableHeader>
                  <TableHeader>Sexo</TableHeader>
                  <TableHeader>Data de Nascimento</TableHeader>
                  <TableHeader>Modalidade</TableHeader>
                  <TableHeader>Categoria</TableHeader>
                  <TableHeader>Kit</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={fields}>
                  {(field, index) => (
                    <TableRow>
                      <TableCell>
                        {form.getValues(`teamMembers.${index}.user.fullName`)}
                      </TableCell>
                      <TableCell>
                        {form.getValues(`teamMembers.${index}.user.gender`) ===
                        "male"
                          ? "Masculino"
                          : "Feminino"}
                      </TableCell>
                      <TableCell>
                        {form.getValues(`teamMembers.${index}.user.birthDate`)}
                      </TableCell>
                      <TableCell>
                        {
                          eventGroup.EventModality.find(
                            (mod) =>
                              mod.id ===
                              form.getValues(
                                `teamMembers.${index}.registration.modalityId`
                              )
                          )?.name
                        }
                      </TableCell>
                      <TableCell>
                        {
                          eventGroup.EventModality.find(
                            (mod) =>
                              mod.id ===
                              form.getValues(
                                `teamMembers.${index}.registration.modalityId`
                              )
                          )?.modalityCategory.find(
                            (cat) =>
                              cat.id ===
                              form.getValues(
                                `teamMembers.${index}.registration.categoryId`
                              )
                          )?.name
                        }
                      </TableCell>
                      <TableCell>
                        {
                          eventGroup.EventAddon?.find(
                            (addon) =>
                              addon.id ===
                              form.getValues(
                                `teamMembers.${index}.registration.addon.id`
                              )
                          )?.name
                        }{" "}
                        {form.getValues(
                          `teamMembers.${index}.registration.addon.option`
                        ) &&
                          ` - ${form.getValues(`teamMembers.${index}.registration.addon.option`)}`}
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </TableMock>
          </div>
        </div>
      </div>
    </>
  );
}
