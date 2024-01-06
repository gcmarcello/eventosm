"use client";
import { ErrorResponse, SuccessResponse } from "@/app/api/_shared/utils/ActionResponse";
import { useId } from "react";
import useSWRMutation from "swr/mutation";

type FetcherResponse<T> = Promise<T>;

interface UseActionParams<
  ArgumentType,
  DataReturnType,
  FormatterReturnType,
  ParserReturnType,
> {
  defaultData?: ParserReturnType;
  redirect?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (res: SuccessResponse<ParserReturnType>) => void;
  parser?: (arg: DataReturnType) => ParserReturnType;
  formatter?: (arg: ArgumentType) => FormatterReturnType;
  action: (
    arg: FormatterReturnType | ArgumentType
  ) => Promise<SuccessResponse<DataReturnType> | ErrorResponse | void>;
}

export function useAction<
  ArgumentType,
  DataReturnType,
  FormatterReturnType = ArgumentType,
  ParserReturnType = DataReturnType,
>({
  defaultData,
  redirect,
  action,
  onSuccess,
  onError,
  formatter,
  parser,
}: UseActionParams<ArgumentType, DataReturnType, FormatterReturnType, ParserReturnType>) {
  const id = useId();

  const fetcher = (
    arg: ArgumentType
  ): FetcherResponse<SuccessResponse<ParserReturnType>> => {
    const formattedArg = formatter ? formatter(arg) : arg;

    return action(formattedArg)
      .then((res) => {
        if (res && "error" in res) {
          throw res.message;
        }
        if (redirect) {
          return {
            data: null as ParserReturnType,
            message: `Redirecionando...`,
          };
        }
        if (!res) {
          throw "Resposta indefinida.";
        }
        if (!res.data) {
          throw "Resposta sem dados.";
        }
        return {
          data: (parser ? parser(res.data) : res.data) as ParserReturnType,
          pagination: res.pagination,
          message: res.message,
        };
      })
      .catch((error) => {
        throw error;
      });
  };

  const mutation = useSWRMutation<
    SuccessResponse<ParserReturnType>,
    string,
    string,
    ArgumentType
  >(id, (url: string, { arg }) => fetcher(arg), {
    onSuccess: (data) => onSuccess && onSuccess(data),
    onError: (error) => onError && onError(error),
  });

  const actionResult = {
    ...mutation,
    data: (mutation?.data?.data || defaultData) as ParserReturnType,
    pagination: mutation?.data?.pagination,
  };

  return actionResult;
}
