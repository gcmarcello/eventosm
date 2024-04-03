import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CreateClientDto } from "./dto/client.dto";
import { catchError, firstValueFrom } from "rxjs";
import { SettingsService } from "../settings/settings.service";

@Injectable()
export class AsaasService {
  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService
  ) {}

  async asaasRequest({
    body,
    url,
    method,
  }: {
    body?: any;
    url: string;
    method: "post" | "get" | "put" | "delete";
  }) {
    const { data }: { data: any } = await firstValueFrom(
      this.httpService[method]("https://sandbox.asaas.com/api/v3" + url, body, {
        headers: { access_token: this.settingsService.asaasApiKey },
      }).pipe(
        catchError((error) => {
          console.log(error.response);
          throw error;
        })
      )
    );
    return data;
  }

  async createClient(body: CreateClientDto) {
    return await this.asaasRequest({
      body,
      url: "/customers",
      method: "post",
    });
  }
}
