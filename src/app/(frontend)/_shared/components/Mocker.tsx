"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import { FieldValues, UseFormReturn, Path } from "react-hook-form";

export function mockData<T extends FieldValues>({
  form,
  data,
}: {
  form: UseFormReturn<T>;
  data: T;
}) {
  for (const [key, value] of Object.entries(data) as [keyof T, T[keyof T]][]) {
    // Ensure the key is a valid key of T
    if (key in form.getValues()) {
      form.setValue(key as Path<T>, value);
    }
  }
  console.log(form.getValues());
  form.trigger();
}

export function Mocker({ mockData, submit }: { mockData?: any; submit?: any }) {
  const [isFolded, setIsFolded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="flex items-center gap-3 ">
      {isFolded ? (
        <ChevronLeftIcon
          width={35}
          height={35}
          className="text-gray-500 hover:cursor-pointer"
          onClick={() => setIsFolded(false)}
        />
      ) : (
        <>
          <ChevronRightIcon
            width={35}
            height={35}
            className="text-gray-500 hover:cursor-pointer"
            onClick={() => setIsFolded(true)}
          />
          <ArrowPathIcon
            width={35}
            height={35}
            onClick={() => {
              if (window) window.location.reload();
            }}
            className="text-emerald-500 hover:cursor-pointer"
          />
          {isSubmitting ? (
            <PaperAirplaneIcon
              width={35}
              height={35}
              className="pointer-events-none animate-spin text-gray-500"
            />
          ) : (
            <PaperAirplaneIcon
              width={35}
              height={35}
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(async () => {
                  await submit();
                  setIsSubmitting((prev) => !prev);
                }, 500);
              }}
              className="text-red-500 hover:cursor-pointer"
            />
          )}
          <img
            alt="mock data"
            onClick={mockData}
            className="hover:cursor-pointer "
            src="https://fakerjs.dev/logo.svg"
            width={35}
            height={35}
          />
        </>
      )}
    </div>
  );
}

export function BottomRightMocker({
  mockData,
  submit,
}: {
  mockData?: any;
  submit?: any;
}) {
  return (
    <div className="absolute bottom-0 right-0 p-4">
      <Mocker mockData={mockData} submit={submit} />
    </div>
  );
}

export function TopLeftMocker({ mockData, submit }: { mockData?: any; submit?: any }) {
  return (
    <div className="absolute left-0 top-0 p-4">
      <Mocker mockData={mockData} submit={submit} />
    </div>
  );
}
