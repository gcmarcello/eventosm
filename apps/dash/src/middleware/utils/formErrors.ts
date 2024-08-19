import { UseFormReturn } from "odinkit/client";
import { FieldValues, Path } from "react-hook-form";

type MutationError<T extends FieldValues> = {
  message: string;
  error?: string;
  property?: "root" | `root.${string}` | Path<T>;
  errors?: {
    property: "root" | `root.${string}` | Path<T>;
    constraints: Record<string, string>;
  }[];
};

export function handleFormError<T>(
  error: any,
  form?: UseFormReturn<T extends FieldValues ? T : FieldValues>
) {
  const parsedError = error as MutationError<
    T extends FieldValues ? T : FieldValues
  >;
  const parsedMessage =
    parsedError.message === "Validation failed"
      ? "Verifique os campos destacados."
      : parsedError.message;

  if (form) {
    if ("errors" in parsedError) {
      if (!parsedError.errors?.length) return;
      for (const err of parsedError.errors) {
        form.setError(err.property, {
          message: Object.values(err.constraints)[0],
        });
      }
    } else if (parsedError.property) {
      form.setError(parsedError.property, { message: parsedMessage });
    } else {
      form.setError("root.serverError", { message: parsedMessage });
    }
  }
  return parsedError;
}
