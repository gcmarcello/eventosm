import { showToast, UseFormReturn } from "odinkit/client";
import { FieldValues, Path } from "react-hook-form";
import useSWRMutation from "swr/mutation";

type MutationError<T extends FieldValues> = {
  message: string;
  error?: string;
  errors?: {
    property: "root" | `root.${string}` | Path<T>;
    constraints: Record<string, string>;
  }[];
};

export function useFetch<T, R>(props: {
  url: string;
  options: RequestInit;
  form?: UseFormReturn<T extends FieldValues ? T : FieldValues>;
  onError?: (error: any) => void;
  onSuccess?: (data: R) => void;
}) {
  const fetcher = async (key: string, { arg }: { arg: T }): Promise<R> => {
    const response = await fetch(key, {
      method: props.options.method,
      body: JSON.stringify(arg),
      headers: { "Content-Type": "application/json", ...props.options.headers },
    });
    const parsedResponse = await response.json();

    if (!response.ok) {
      throw parsedResponse;
    }

    return parsedResponse;
  };

  const { trigger, isMutating, data, error } = useSWRMutation(
    props.url,
    fetcher,
    {
      throwOnError: false,
      onError: (error) => {
        props.onError && props.onError(error);
      },
      onSuccess: (data) => {
        props.onSuccess && props.onSuccess(data);
      },
    }
  );

  return { trigger, error, isMutating, data };
}

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
    } else {
      form.setError("root.serverError", { message: parsedMessage });
    }
  }
  return parsedError;
}
