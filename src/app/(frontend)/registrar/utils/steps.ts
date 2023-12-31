import { UseFormReturn } from "react-hook-form";

export function verifyStep(step: number, form: UseFormReturn<any>) {
  if (!form.getValues()[`step${step + 1}`]) return false;
  const fields = Object.entries(form.getValues()[`step${step + 1}`]);
  const dirtyFields = fields.flatMap(([key, value]): [string, string][] => {
    if (typeof value === "object") {
      return Object.entries(value as any).map(([subKey, subValue]) => {
        return [`${key}.${subKey}`, (subValue as string)?.toString()]; // Convert subValue to string
      });
    } else {
      return [[key, (value as any).toString()]]; // Convert value to string and wrap in an array
    }
  });

  if (dirtyFields.some((field) => !field[1])) return false;
  if (form.formState.errors[`step${step + 1}`]) return false;

  return true;
}
