import clsx from "clsx";
import dayjs from "dayjs";
import { For } from "odinkit";
import {
  Button,
  UseFormReturn,
  useField,
  useFormContext,
} from "odinkit/client";
import { useMemo } from "react";

export function QuickTimesButtons() {
  const { name } = useField();
  const form = useFormContext();
  const dates = useMemo(
    () => [
      { label: "00:00", value: "00:00" },
      { label: "12:00", value: "12:00" },
      {
        label: "23:59",
        value: "23:59",
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
