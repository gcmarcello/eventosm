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
import { signup } from "@/app/api/auth/action";
import { useAction } from "../_shared/hooks/useAction";
import { showToast } from "../_shared/components/Toast";
import { readAddressFromZipCode } from "@/app/api/geo/service";
import { Text } from "../_shared/components/Text";
import { Input } from "../_shared/components/Form/Input";
import { Logo } from "../_shared/components/Logo";
import { Button } from "../_shared/components/Button";

const Field = createField({
  zodObject: loginDto,
});

export default function LoginPage() {
  const form = useForm<LoginDto>({
    resolver: zodResolver(loginDto),
    mode: "onChange",
  });

  const { trigger: signUpAction, isMutating: isLoading } = useAction({
    action: signup as any,
    onError: (error) => {
      console.log(error);
      showToast({ message: "Erro inesperado", variant: "error", title: "Erro" });
      /* form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      }); */
    },
  });

  return (
    <div className="grid grid-cols-1 py-20 lg:grid-cols-4">
      <div className="col-span-full lg:col-span-2 lg:col-start-2">
        <Container className="mx-4 mb-20 mt-4 lg:col-start-2 lg:mb-10">
          <Form
            hform={form}
            onSubmit={(data) => signUpAction(data)}
            className="px-4 py-4 lg:pb-4"
          >
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <Logo />
              <span className="text-2xl text-zinc-500 dark:text-zinc-400">EventoSM</span>
            </div>
            <Fieldset>
              <FieldGroup>
                <Field name="identifier">
                  <Label>CPF</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="password">
                  <Label>Senha</Label>
                  <Input type="password" />
                  <ErrorMessage />
                </Field>
              </FieldGroup>
              <div className="mt-4 flex justify-end">
                <Button type="submit" color="lime">
                  <span className="px-4">Login</span>
                </Button>
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
