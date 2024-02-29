export class SendEmailDto {
  from: string;
  to: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  mailSettings: {
    sandboxMode: {
      enable: boolean;
    };
  };
}
