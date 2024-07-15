"use client";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Avatar, z } from "odinkit";
import { Form, Input, useForm } from "odinkit/client";
import { useMemo } from "react";

export default function Home() {
  const form = useForm({
    schema: z.object({
      search: z.string().optional(),
    }),
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <div className="-mb-5 bg-lime-300 pb-4">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 ">
          <Avatar
            className="size-10 border-2 border-white"
            src={
              "https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
            }
          />{" "}
          <div className="text-sm font-normal text-zinc-800">Hi, John Doe</div>
        </div>
        <Bars3Icon className="h-6 w-6" />
      </div>

      <div className="p-4 text-2xl font-semibold text-zinc-800">
        Encontre eventos <br /> perto de você!
      </div>

      <div className="relative mt-4 flex justify-center">
        <Form className="absolute -top-2 px-4" hform={form}>
          <Field name="search">
            <Input
              icon={<MagnifyingGlassIcon className="size-5" />}
              placeholder="Procure por cidade ou evento."
              className={"rounded-xl"}
            />
          </Field>
        </Form>
      </div>
    </div>
  );
}
