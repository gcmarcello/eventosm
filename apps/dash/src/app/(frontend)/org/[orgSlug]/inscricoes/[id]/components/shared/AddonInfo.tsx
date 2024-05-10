import clsx from "clsx";
import { For, Text } from "odinkit";
import { Radio as HeadlessRadio } from "@headlessui/react";
import {
  Description,
  FieldGroup,
  Fieldset,
  Label,
  RadioField,
  RadioGroup,
  Select,
  useFormContext,
} from "odinkit/client";
import { EventWithInfo } from "prisma/types/Events";
import { useMemo } from "react";
import Image from "next/image";
import { Organization } from "@prisma/client";

export function AddonInfo({
  event,
  organization,
}: {
  event: EventWithInfo;
  organization: Organization;
}) {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), [form]);

  return (
    <Fieldset>
      <FieldGroup className="col-span-2 lg:col-span-1 lg:ps-4">
        <Field enableAsterisk={false} name="registration.addon.id">
          <Label>Escolha seu Kit</Label>
          <Description>Selecione seu kit para o evento.</Description>
          <RadioGroup
            className={
              "wrap flex max-w-[100vw] flex-col justify-between space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0"
            }
          >
            <For each={event.EventAddon || []}>
              {(addon) => {
                const options =
                  (addon.options as (string | number)[])?.map((option) => ({
                    name: option,
                    id: option,
                  })) || [];

                return (
                  <RadioField className="grow" custom={true}>
                    <HeadlessRadio value={addon.id}>
                      {({ checked }) => (
                        <div
                          style={{
                            backgroundColor: checked
                              ? organization.options.colors.primaryColor.hex +
                                "60"
                              : "",
                          }}
                          className={clsx(
                            "flex min-h-32 min-w-32 grow  cursor-pointer flex-col rounded-md border border-slate-200 bg-opacity-25 p-4 shadow-md duration-200 hover:bg-slate-400 hover:bg-opacity-25 lg:flex-row lg:divide-x"
                          )}
                        >
                          {addon.image && (
                            <div className="relative h-28 w-28 ">
                              <Image
                                className="pe-4"
                                alt="kit image"
                                fill={true}
                                src={addon.image}
                              />
                            </div>
                          )}
                          <div className="ps-4">
                            <div className="font-medium">{addon.name}</div>
                            {addon.description && (
                              <Text>{addon.description}</Text>
                            )}
                            {checked && (addon.options as string[])?.length ? (
                              <Field name="registration.addon.option">
                                <Select data={options} displayValueKey="name" />
                              </Field>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </HeadlessRadio>
                  </RadioField>
                );
              }}
            </For>
          </RadioGroup>
        </Field>
      </FieldGroup>
    </Fieldset>
  );
}
