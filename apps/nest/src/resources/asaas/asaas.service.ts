import { Injectable } from "@nestjs/common";
import { SettingsService } from "../settings/settings.service";
import axios from "axios";

@Injectable()
export class AsaasService {
  constructor(private readonly settingsService: SettingsService) {}

  async request({
    body,
    url,
    method,
  }: {
    body?: any;
    url: string;
    method: "post" | "get" | "put" | "delete";
  }) {
    const headers = {
      access_token: this.settingsService.asaasApiKey,
      accept: "application/json",
    };

    const apiUrl = "https://sandbox.asaas.com/api/v3" + url;

    try {
      if (method === "get" || method === "delete") {
        const response = await axios.get(apiUrl, { headers });
        return response.data;
      } else {
        const { data } = await axios[method](apiUrl, body, { headers });
        return data;
      }
    } catch (error) {
      const errorMessage = (error as any).response.data.errors;
      console.log(errorMessage);
      return errorMessage;
    }
  }
}
