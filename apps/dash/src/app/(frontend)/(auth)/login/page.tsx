"use client";
import "reflect-metadata";
import { LoginDto } from "shared-types/dist/index.client";
import {
  Button,
  Checkbox,
  Description,
  ErrorMessage,
  FieldGroup,
  Form,
  Input,
  Label,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo } from "react";
import Link from "next/link";
import { login, setCookie } from "@/app/api/auth/action";
import { useRouter } from "next/navigation";
import { SubmitButton } from "odinkit";
import { handleFormError } from "@/middleware/utils/formErrors";

export default function LoginPage() {
  const form = useForm({
    schema: LoginDto,
    mode: "onChange",
  });

  const Field = useMemo(() => form.createField(), []);

  const router = useRouter();

  const { trigger, isMutating } = useAction({
    action: login,
    redirect: true,
    onSuccess: () => router.push("/painel"),
    onError: (error) => {
      handleFormError(error, form);
    },
  });

  return (
    <div className="grid min-h-full flex-1 grid-cols-8 dark:bg-zinc-900  lg:dark:bg-zinc-950">
      <div className="col-span-8 flex flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:flex-none lg:px-16 lg:py-12 xl:col-span-3 xl:px-16">
        <div className="mx-auto w-full ">
          <div>
            <img
              className="h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
              Login EventoSM
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Ainda não tem cadastro?{" "}
              <Link
                href="/cadastro"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Clique aqui!
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <Form
                hform={form}
                onSubmit={(data) => trigger(data)}
                className="space-y-6"
              >
                <FieldGroup className="space-y-6">
                  <Field name="identifier">
                    <Label>Email ou Documento</Label>
                    <Input />
                    <ErrorMessage />
                  </Field>
                  <Field name="password">
                    <Label>Senha</Label>
                    <Input type="password" />
                    <ErrorMessage />
                  </Field>
                </FieldGroup>

                <div className="flex items-end justify-between">
                  <Field name="remember">
                    <Checkbox color="indigo" />
                    <Label className={"ms-2"}>Manter Conectado</Label>
                    {form.watch("remember") && (
                      <Description>
                        Você permanecerá conectado por 1 semana.
                      </Description>
                    )}
                  </Field>

                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                </div>
                {form.formState.errors.root?.serverError && (
                  <div className="text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500">
                    {form.formState.errors.root.serverError.message}
                  </div>
                )}
                <div className="flex">
                  <SubmitButton className={"w-full"} color="indigo">
                    Login
                  </SubmitButton>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden flex-1  xl:col-span-5 xl:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://c02.purpledshub.com/uploads/sites/39/2022/10/Fox-DHX-Factory-rear-mountain-bike-shock-2-3e0ee7f.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
