import { validateRecoveryToken } from "@/app/api/auth/recovery/service";
import { Alertbox, Link } from "odinkit";
import { CreateNewPasswordForm } from "./components/RecoveryContainer";
import { createToken } from "@/app/api/auth/service";

export default async function PasswordRecoveryPage({
  params,
}: {
  params: { recoveryToken: string };
}) {
  try {
    const token = await validateRecoveryToken({
      token: params.recoveryToken,
    });
    return (
      <div className="flex flex-1 flex-col justify-center px-4 py-1 sm:px-6 lg:flex-none lg:px-20 lg:py-12 xl:px-24">
        <CreateNewPasswordForm token={token.token} />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-1 flex-col justify-center px-4 py-6 sm:px-6 lg:flex-none lg:px-20 lg:py-12 xl:px-24">
        <Alertbox title="Erro!" type="error">
          <Link href="/recuperar" className="underline">
            Clique aqui
          </Link>{" "}
          para retornar a recuperação de senha.
        </Alertbox>
      </div>
    );
  }
}
