import { notFound } from "next/navigation";
import { Alertbox } from "odinkit";
import LoginForm from "./components/LoginForm";
import prisma from "prisma/prisma";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: { orgSlug: string };
  searchParams: { alert?: string; email?: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
  });

  if (!organization) {
    return notFound();
  }

  function LoginAlert() {
    switch (searchParams.alert) {
      case "successRegistration":
        return <SignupConfirmation />;
      case "successRecovery":
        return <RecoveryConfirmation email={searchParams.email || ""} />;
      case "errorConfirm":
        return <ConfirmationError />;
      case "successConfirm":
        return <ConfirmationSuccess />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:flex-none lg:px-16 lg:py-12 xl:px-20">
        <LoginAlert />
        <LoginForm organization={organization} />
      </div>
    </>
  );
}

export function SignupConfirmation() {
  return (
    <Alertbox type="success">
      <p className="mb-2 font-medium">
        Para concluir seu cadastro, você precisa confirmar sua conta.
      </p>

      <ul className="list-disc space-y-2">
        <li>
          Verifique sua caixa de entrada de e-mail (spam e lixo eletrônico) e
          localize o e-mail de confirmação que enviamos para você.{" "}
        </li>
        <li>Nele você encontrará o link de confirmação da sua conta.</li>
      </ul>
    </Alertbox>
  );
}

export function RecoveryConfirmation({ email }: { email?: string }) {
  return (
    <Alertbox type="success">
      <div className="flex flex-col gap-2">
        <p className="">
          Um email com as instruções para cadastrar uma nova senha foi enviado
          para:{" "}
        </p>

        <p>{email || `[email]`}</p>

        <p className="font-medium">
          Por favor, verifique também as caixas de Spam e Lixo Virtual.
        </p>
      </div>
    </Alertbox>
  );
}

export function ConfirmationError() {
  return (
    <Alertbox type="error">
      <p className="mb-2">
        Ocorreu um erro ao tentar confirmar sua conta. Por favor, tente
        novamente.
      </p>
    </Alertbox>
  );
}

export function ConfirmationSuccess() {
  return (
    <Alertbox type="success">
      <p className="mb-2">
        Sua conta foi confirmada com sucesso! Você já pode fazer login.
      </p>
    </Alertbox>
  );
}
