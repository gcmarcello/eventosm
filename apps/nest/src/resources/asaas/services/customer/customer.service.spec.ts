import { Test, TestingModule } from "@nestjs/testing";
import { CustomerService } from "./customer.service";

describe("CustomerService", () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createClient", () => {
    it("should call asaasService.request with correct parameters", async () => {
      const body = {
        /* mock body */
      };
      await service.createClient(body);
      expect(service.createClient).toHaveBeenCalledWith({
        body,
        url: "/customers",
        method: "post",
      });
    });
  });

  describe("getClient", () => {
    it("should call asaasService.request with correct parameters", async () => {
      const id = "123";
      await service.getClient(id);
      expect(service.getClient).toHaveBeenCalledWith({
        url: `/customers/${id}`,
        method: "get",
      });
    });
  });

  describe("updateClient", () => {
    it("should call asaasService.request with correct parameters", async () => {
      const id = "123";
      const body = {
        /* mock body */
      };
      await service.updateClient(id, body);
      expect(service.updateClient).toHaveBeenCalledWith({
        body,
        url: `/customers/${id}`,
        method: "put",
      });
    });
  });

  describe("deleteClient", () => {
    it("should call asaasService.request with correct parameters", async () => {
      const id = "123";
      await service.deleteClient(id);
      expect(service.deleteClient).toHaveBeenCalledWith({
        url: `/customers/${id}`,
        method: "delete",
      });
    });
  });
});
