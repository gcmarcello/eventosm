import { getServerEnv } from "@/app/api/env";
import { Email, EmailTemplate } from "email-templates";

export async function sendEmail<T extends EmailTemplate>(arg: Email<T>[]) {
  return await fetch(getServerEnv("QUEUE_URL") + "/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
}
