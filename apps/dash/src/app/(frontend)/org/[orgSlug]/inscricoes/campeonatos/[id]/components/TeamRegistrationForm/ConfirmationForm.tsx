import { CreateMultipleRegistrationsDto } from "@/app/api/registrations/dto";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
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
import { fetchUserInfo } from "../../../../utils/userInfo";
import { TeamWithUsers } from "prisma/types/Teams";
import dayjs from "dayjs";
import { EventGroupCreateMultipleRegistrationsDto } from "@/app/api/registrations/eventGroups/eventGroup.dto";

export function ConfirmationForm({
  fieldArray,
  eventGroup,
  organization,
  teams,
}: {
  teams: TeamWithUsers[];
  organization: Organization;
  eventGroup: EventGroupWithInfo;
  fieldArray: UseFieldArrayReturn<
    EventGroupCreateMultipleRegistrationsDto,
    "teamMembers",
    "id"
  >;
}) {
  const { fields, append } = fieldArray;

  const form = useFormContext<EventGroupCreateMultipleRegistrationsDto>();

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <ClipboardDocumentCheckIcon
          color={organization.options.colors.primaryColor.hex}
          className="h-20 w-20"
        />
        <Text>Confirme os dados dos atletas e finalize a inscrição.</Text>
        <div className="grid grid-cols-4">
          <div className="col-span-4">
            <TableMock>
              <TableHead>
                <TableRow>
                  <TableHeader>Nome Completo</TableHeader>
                  <TableHeader>Sexo</TableHeader>
                  <TableHeader>Modalidade</TableHeader>
                  <TableHeader>Categoria</TableHeader>
                  <TableHeader>Kit</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <For each={fields}>
                  {(field, index) => {
                    const userInfo = fetchUserInfo(field.userId!, teams, form);

                    if (!form.getValues(`teamMembers.${index}.selected`))
                      return <></>;
                    return (
                      <TableRow>
                        <TableCell>{userInfo?.fullName || "xd"}</TableCell>
                        <TableCell>
                          {userInfo?.info.gender === "male"
                            ? "Masculino"
                            : "Feminino"}
                        </TableCell>
                        <TableCell>
                          {
                            eventGroup.EventModality.find(
                              (mod) =>
                                mod.id ===
                                form.getValues(
                                  `teamMembers.${index}.modalityId`
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
                                  `teamMembers.${index}.modalityId`
                                )
                            )?.modalityCategory.find(
                              (cat) =>
                                cat.id ===
                                form.getValues(
                                  `teamMembers.${index}.categoryId`
                                )
                            )?.name
                          }
                        </TableCell>
                        <TableCell>
                          {
                            eventGroup.EventAddon?.find(
                              (addon) =>
                                addon.id ===
                                form.getValues(`teamMembers.${index}.addon.id`)
                            )?.name
                          }{" "}
                          {form.getValues(
                            `teamMembers.${index}.addon.option`
                          ) &&
                            ` - ${form.getValues(`teamMembers.${index}.addon.option`)}`}
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </For>
              </TableBody>
            </TableMock>
          </div>
        </div>
      </div>
    </>
  );
}
