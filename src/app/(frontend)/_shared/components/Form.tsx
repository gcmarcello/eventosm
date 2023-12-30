import {
  Description as HeadlessDescription,
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  type DescriptionProps as HeadlessDescriptionProps,
  type FieldProps as HeadlessFieldProps,
  type FieldsetProps as HeadlessFieldsetProps,
  type LabelProps as HeadlessLabelProps,
  type LegendProps as HeadlessLegendProps,
} from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { createContext, useContext } from "react";
import {
  useForm,
  Path,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

export function Form<Fields extends FieldValues>(props: {
  children?: React.ReactNode;
  onSubmit: (data: Fields) => void;
  hform: ReturnType<typeof useForm<Fields>>;
}) {
  return (
    <FormProvider {...props.hform}>
      <form onSubmit={props.hform?.handleSubmit((data) => props.onSubmit(data))} />
    </FormProvider>
  );
}

export function Fieldset({
  className,
  ...props
}: { disabled?: boolean } & HeadlessFieldsetProps) {
  return (
    <HeadlessFieldset
      {...props}
      className={clsx(
        className,
        "[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1"
      )}
    />
  );
}

export function Legend({ ...props }: HeadlessLegendProps) {
  return (
    <HeadlessLegend
      {...props}
      data-slot="legend"
      className={clsx(
        props.className,
        "text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
      )}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} data-slot="control" className={clsx(className, "space-y-3")} />;
}

const FieldContext = createContext({
  name: "",
  error: "",
});

export function useField() {
  return useContext(FieldContext);
}

type FieldProps<Fields extends FieldValues> = HeadlessFieldProps & {
  name: Path<Fields>;
};

function Field<Fields extends FieldValues>({ className, ...props }: FieldProps<Fields>) {
  const form = useFormContext();

  const name = props["name"];
  const path = name.split(".");

  const fieldContextValue = {
    name,
    error: path.reduce((acc, curr) => acc && acc[curr], form.formState.errors as any)
      ?.message as string,
  };

  return (
    <FieldContext.Provider value={fieldContextValue}>
      <HeadlessField
        className={clsx(
          className,
          "[&>[data-slot=label]+[data-slot=control]]:mt-3",
          "[&>[data-slot=label]+[data-slot=description]]:mt-1",
          "[&>[data-slot=description]+[data-slot=control]]:mt-3",
          "[&>[data-slot=control]+[data-slot=description]]:mt-3",
          "[&>[data-slot=control]+[data-slot=error]]:mt-3",
          "[&>[data-slot=label]]:font-medium"
        )}
        {...props}
      />
    </FieldContext.Provider>
  );
}

export function createField<T extends FieldValues>() {
  const _Field = (props: FieldProps<T>) => {
    return <Field {...props} />;
  };

  return _Field;
}

export function Label({
  className,
  ...props
}: { className?: string } & HeadlessLabelProps) {
  return (
    <HeadlessLabel
      {...props}
      data-slot="label"
      className={clsx(
        className,
        "select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
      )}
    />
  );
}

export function Description({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps) {
  return (
    <HeadlessDescription
      {...props}
      data-slot="description"
      className={clsx(
        className,
        "text-base/6 text-zinc-500 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-zinc-400"
      )}
    />
  );
}

export function ErrorMessage({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps) {
  const { error } = useContext(FieldContext)!;

  return (
    <HeadlessDescription
      {...props}
      data-slot="error"
      className={clsx(
        className,
        "text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500"
      )}
    >
      {error}
    </HeadlessDescription>
  );
}
