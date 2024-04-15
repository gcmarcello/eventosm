"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginDto, loginDto } from "@/app/api/auth/dto";

import { login } from "@/app/api/auth/action";
import {
  Button,
  ErrorMessage,
  FieldGroup,
  Form,
  Input,
  Label,
  useForm,
  showToast,
  useAction,
  DialogTitle,
  Dialog,
  DialogBody,
  DialogActions,
} from "odinkit/client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Alertbox,
  ButtonSpinner,
  For,
  Heading,
  SubmitButton,
  Text,
  date,
} from "odinkit";
import clsx from "clsx";
import dayjs from "dayjs";
import { Organization, User, UserOrgLink } from "@prisma/client";
import { UserWithoutPassword } from "prisma/types/User";

export default function LoginForm({
  organization,
}: {
  organization: Organization;
}) {
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const searchParams = useSearchParams();
  const [user, setUser] = useState<
    | (UserWithoutPassword & {
        UserOrgLink: (UserOrgLink & { Organization: Organization })[];
      })
    | null
  >(null);
  const params = useSearchParams();
  const form = useForm({
    schema: loginDto,
    mode: "onChange",
    defaultValues: {
      identifier:
        params.get("alert") === "successRecovery"
          ? ""
          : params.get("email") ?? undefined,
      redirect: params.get("redirect") || "/",
      organizationId: organization.id,
    },
  });

  const Field = useMemo(() => form.createField(), []);

  const { trigger: loginTrigger, isMutating: isLoading } = useAction({
    action: login,
    redirect: "unknown",
    onSuccess: (data) => {
      if (data.data) {
        setUser(
          data.data as UserWithoutPassword & {
            UserOrgLink: (UserOrgLink & { Organization: Organization })[];
          }
        );
      }
    },
    onError: (error) => {
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro",
      });
    },
  });

  useEffect(() => {
    if (user) {
      setOpenTermsModal(true);
    }
  }, [user]);

  console.log(user);

  return (
    <>
      {user && (
        <Dialog open={openTermsModal} onClose={setOpenTermsModal}>
          <DialogTitle onClose={() => setOpenTermsModal(false)} className="">
            Conectar Conta EventoSM
          </DialogTitle>
          <DialogBody>
            <div className="mt-3 flex flex-col gap-y-2">
              <Text className="font-semibold">
                Olá {user?.fullName.split(" ")[0]}!
              </Text>

              <Heading>
                Detectamos que você já possui uma conta cadastrada nas seguintes
                organizações:
              </Heading>
              <ul className="my-3">
                <For each={user?.UserOrgLink!}>
                  {(org) => (
                    <li>
                      <div className="flex items-center gap-3">
                        <img
                          src={org.Organization.options.images?.logo}
                          className="max-w-28"
                          alt=""
                        />
                        <Text>{org.Organization.name}</Text>
                      </div>
                    </li>
                  )}
                </For>
              </ul>

              <Text>
                Ao conectar sua conta, você não precisará preencher outro
                cadastro, e seus dados serão compartilhados com a{" "}
                {organization.name}.
              </Text>
            </div>
          </DialogBody>
          <DialogActions>
            <Button
              color={organization.options.colors.secondaryColor.tw.color}
              href="./cadastro"
            >
              Cadastrar nova conta
            </Button>
            <Button
              color={organization.options.colors.primaryColor.tw.color}
              loading={isLoading}
              onClick={() =>
                loginTrigger({ ...form.getValues(), acceptTerms: true })
              }
            >
              Conectar conta
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          {/* <img
              className="h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            /> */}
          <div className="mt-8 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Login
            </h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            Ainda não tem cadastro?{" "}
            <Link
              href="/cadastro"
              className={clsx(
                "font-semibold",
                `text-${organization.options.colors.primaryColor}-600 hover:text-${organization.options.colors.primaryColor}-500`
              )}
            >
              Clique aqui!
            </Link>
          </p>
        </div>

        <div className="mt-10">
          <div>
            <Form
              hform={form}
              onSubmit={(data) => loginTrigger(data)}
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

              <div className="flex items-center justify-between">
                {/* <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-3 block text-sm leading-6 text-gray-700"
                      >
                        Manter conectado
                      </label>
                    </div> */}

                <div className="text-sm leading-6">
                  <Link
                    href="/recuperar"
                    className={clsx(
                      "font-semibold",
                      `text-${organization.options.colors.primaryColor}-600 hover:text-${organization.options.colors.primaryColor}-500`
                    )}
                  >
                    Esqueceu a senha ou não configurou?
                  </Link>
                </div>
              </div>

              <div className="flex">
                <SubmitButton
                  className={"w-full"}
                  color={organization.options.colors.primaryColor.tw.color}
                >
                  Login
                </SubmitButton>
              </div>
            </Form>
            <div className="mt-5 text-center text-xs leading-6 text-gray-500 lg:mt-8 lg:text-start">
              Tecnologia EventoSM® {dayjs().get("year")}
            </div>
          </div>

          {/* <div className="mt-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-6 text-gray-900">
                      Or continue with
                    </span>
                  </div>
                </div>
  
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                        fill="#34A853"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </a>
  
                  <a
                    href="#"
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg
                      className="h-5 w-5 fill-[#24292F]"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      GitHub
                    </span>
                  </a>
                </div>
              </div> */}
        </div>
      </div>
    </>
  );
}
