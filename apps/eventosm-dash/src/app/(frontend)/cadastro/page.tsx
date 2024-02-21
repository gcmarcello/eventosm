import { readStates } from "@/app/api/geo/service";
import FormContainer from "./components/FormContainer";

export default async function SignupPage() {
  const states = await readStates();
  return <FormContainer states={states} />;
}
