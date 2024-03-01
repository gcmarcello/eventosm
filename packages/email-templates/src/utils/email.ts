import * as templates from "../templates";
import { MailDataRequired } from "@sendgrid/mail";

export type Email<
  T extends keyof typeof templates,
  P extends Parameters<(typeof templates)[T]>[0] = Parameters<
    (typeof templates)[T]
  >[0],
> = {
  template: keyof typeof templates;
  templateParameters: P;
  setup: Omit<MailDataRequired, "html">;
};
