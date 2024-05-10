import { Controller } from "@nestjs/common";
import { SubAccountService } from "./services/subaccount.service";

@Controller("asaas")
export class AsaasController {
  constructor(private readonly subAccountService: SubAccountService) {}
}
