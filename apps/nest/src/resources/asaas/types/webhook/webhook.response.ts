export interface CreateWebhookResponse {
  id: string;
  name: string;
  url: string;
  email: string;
  enabled: boolean;
  interrupted: boolean;
  apiVersion: number;
  authToken: null;
  sendType: string;
  events: string[];
}
