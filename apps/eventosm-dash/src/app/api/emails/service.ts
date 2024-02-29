import sgMail from "@sendgrid/mail";
import * as templates from "./templates";
import { getEnv, isDev } from "@/utils/settings";

sgMail.setApiKey(getEnv("SENDGRID_API_KEY") || "SENDGRID_API_KEY not set");

export async function sendEmail<
  T extends keyof typeof templates,
  P extends Parameters<(typeof templates)[T]>[0],
>(
  template: T,
  setup: { subject: string; to: string | string[]; bcc?: string | string[] },
  templateParameters: P
) {
  /* if (isDev) return; */

  const html = (templates[template] as any)(templateParameters);

  const sendGridEmail = getEnv("SENDGRID_EMAIL");

  if (!sendGridEmail) throw "SENDGRID_EMAIL not set";
  await sgMail
    .send({
      from: sendGridEmail,
      to: setup.to,
      bcc: setup.bcc,
      subject: setup.subject,
      html,
    })
    .then(() => console.log("Email sent"))
    .catch((err) => {
      console.log(err.response.body.errors);
      throw "Failed to send email";
    });
}
