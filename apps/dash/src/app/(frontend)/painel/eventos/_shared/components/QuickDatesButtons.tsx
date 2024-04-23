import clsx from "clsx";
import dayjs from "dayjs";
import { For } from "odinkit";
import { Button, useField, useFormContext } from "odinkit/client";
import { useMemo } from "react";

export function QuickDatesButtons() {
  const { name } = useField();
  const form = useFormContext();
  const dates = useMemo(
    () => [
      { label: "Hoje", value: dayjs().format("DD/MM/YYYY") },
      { label: "Amanhã", value: dayjs().add(1, "day").format("DD/MM/YYYY") },
      {
        label: "Próxima Semana",
        value: dayjs().add(1, "week").format("DD/MM/YYYY"),
      },
    ],
    []
  );
  return (
    <div className="hidden gap-2 lg:flex">
      <For each={dates}>
        {({ label, value }) => (
          <Button
            key={label}
            plain
            className={clsx("grow cursor-pointer hover:underline")}
            onClick={() => {
              form.setValue(name, value);
              form.trigger(name);
            }}
          >
            {label}
          </Button>
        )}
      </For>
    </div>
  );
}
