"use client";

import { useState } from "react";
import { Container } from "../_shared/components/Containers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginDto, loginDto } from "@/app/api/auth/dto";
import {
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Label,
  Legend,
  createField,
} from "../_shared/components/Form/Form";
import { BottomRightMocker, TopLeftMocker, mockData } from "../_shared/components/Mocker";
import { fakerPT_BR } from "@faker-js/faker";
import { cpfMock } from "@/utils/mock/cpfMock";
import { useSearchParams } from "next/navigation";
import { login, signup } from "@/app/api/auth/action";
import { useAction } from "../_shared/hooks/useAction";
import { showToast } from "../_shared/components/Toast";
import { readAddressFromZipCode } from "@/app/api/geo/service";
import { Text } from "../_shared/components/Text";
import { Input } from "../_shared/components/Form/Input";
import { Logo } from "../_shared/components/Logo";
import { Button } from "../_shared/components/Button";
import { Link } from "../_shared/components/Link";

const Field = createField({
  zodObject: loginDto,
});

export default function LoginPage() {
  const form = useForm<LoginDto>({
    resolver: zodResolver(loginDto),
    mode: "onChange",
  });

  const { trigger: loginTrigger, isMutating: isLoading } = useAction({
    action: login as any,
    redirect: true,
    onError: (error) => {
      form.resetField("password");
      showToast({ message: error, variant: "error", title: "Erro" });
      /* form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      }); */
    },
  });

  return (
    <div className="grid grid-cols-1 py-20 lg:grid-cols-6">
      <div className="col-span-full lg:col-span-2 lg:col-start-3">
        <Container className="mx-4 mb-20 mt-4 lg:col-start-2 lg:mb-10">
          <Form
            hform={form}
            onSubmit={(data) => loginTrigger(data)}
            className="px-4 py-4 lg:pb-4"
          >
            <div className="mb-6 flex gap-4">
              <span className="text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white">
                Login - EventoSM
              </span>
            </div>
            <Fieldset>
              <FieldGroup>
                <Field name="identifier">
                  <Label>Email, Documento ou Celular</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="password">
                  <Label>Senha</Label>
                  <Input type="password" />
                  <ErrorMessage />
                </Field>
              </FieldGroup>

              <Text className="underline">Esqueceu a senha?</Text>
              <div className="my-4 flex">
                <Button type="submit" color="lime" className="w-full">
                  <span className="px-4">Login</span>
                </Button>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <Text>
                  Ainda não tem uma conta?{" "}
                  <Link href="/registrar" className="text-lime-300 underline">
                    Cadastre-se
                  </Link>
                </Text>
              </div>
            </Fieldset>
          </Form>
        </Container>
        <BottomRightMocker
          mockData={() =>
            mockData({ form, data: { identifier: "teste", password: "123456" } })
          }
        />
      </div>
    </div>
  );
}
