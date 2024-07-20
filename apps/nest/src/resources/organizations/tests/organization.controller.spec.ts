import { Test, TestingModule } from "@nestjs/testing";
import {
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "../dto/organization.dto";
import { OrganizationPermissions } from "../entities/organizationPermission.entity";
import { OrganizationService } from "../services/organization.service";
import { OrganizationController } from "../organization.controller";

describe("OrganizationController", () => {
  let controller: OrganizationController;
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [OrganizationService],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    service = module.get<OrganizationService>(OrganizationService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findOrganizations", () => {
    it("should return an error if the user does not have permission", async () => {
      const data: ReadOrganizationDto = {};
      const result = await controller.findOrganizations(data);
      expect(result).toEqual({ error: "Permission denied." });
    });
  });
});
