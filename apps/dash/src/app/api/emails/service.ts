import sgMail from "@sendgrid/mail";
import * as templates from "./templates";
import { getEnv, isDev } from "@/utils/settings";

sgMail.setApiKey(getEnv("SENDGRID_API_KEY") || "SENDGRID_API_KEY not set");

sgMail.setApiKey(getEnv("SENDGRID_API_KEY") || "SENDGRID_API_KEY not set");

export async function sendEmail<
  T extends keyof typeof templates,
  P extends Parameters<(typeof templates)[T]>[0],
>(
  arg: Array<{
    template: T;
    setup: {
      subject: string;
      to: string | string[];
      bcc?: string | string[];
    };
    templateParameters: P;
  }>
): Promise<void>;

export async function sendEmail<T extends keyof typeof templates>(
  arg: T,
  setup: { subject: string; to: string | string[]; bcc?: string | string[] },
  templateParameters: Parameters<(typeof templates)[T]>[0]
): Promise<void>;

export async function sendEmail<
  T extends keyof typeof templates,
  P extends Parameters<(typeof templates)[T]>[0],
>(
  arg:
    | {
        template: T;
        setup: {
          subject: string;
          to: string | string[];
          bcc?: string | string[];
        };
        templateParameters: P;
      }[]
    | T,
  setup?: {
    subject: string;
    to: string | string[];
    bcc?: string | string[];
  },
  templateParameters?: P
) {
  const sendGridEmail = getEnv("SENDGRID_EMAIL");

  if (!sendGridEmail) throw "SENDGRID_EMAIL not set";

  let request;
  if (Array.isArray(arg)) {
    request = arg.map((arg) => {
      const { template, setup, templateParameters } = arg;
      const html = (templates[template] as any)(templateParameters);

      return {
        from: sendGridEmail,
        to: setup.to,
        bcc: setup.bcc,
        subject: setup.subject,
        html,
        mailSettings: {
          sandboxMode: {
            enable: isDev,
          },
        },
      };
    });
  } else {
    const html = (templates[arg] as any)(templateParameters);

    request = {
      from: sendGridEmail,
      to: setup!.to,
      bcc: setup!.bcc,
      subject: setup!.subject,
      html,
      mailSettings: {
        sandboxMode: {
          enable: isDev,
        },
      },
    };
  }

  await fetch(getEnv("QUEUE_URL") + "/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}
