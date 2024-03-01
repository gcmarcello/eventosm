import { Email } from "./email";
import * as templates from "../templates";
import { MailDataRequired } from "@sendgrid/mail";

export function generateSendGridEmail<
  T extends keyof typeof templates,
  P extends Parameters<(typeof templates)[T]>[0],
>(email: Email<T, P>): MailDataRequired {
  const html = (templates[email.template] as any)(email.templateParameters);
  return { ...email.setup, html };
}
