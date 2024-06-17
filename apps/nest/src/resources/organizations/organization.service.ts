import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateOrganizationDto,
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "./dto/organization.dto";
import { Organization } from "./entities/organization.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepo: EntityRepository<Organization>,
    private em: EntityManager
  ) {}

  async findAll() {
    return await this.organizationRepo.findAll();
  }

  async findMany(data: ReadOrganizationDto): Promise<Organization[]> {
    const organizations = await this.organizationRepo.find(data);
    return organizations;
  }

  async findOne(id: string) {
    return await this.organizationRepo.findOne(id);
  }

  async create(dto: CreateOrganizationDto) {
    const organization = this.organizationRepo.create(dto);

    await this.em.flush();
    return organization;
  }

  async update(dto: UpdateOrganizationDto) {
    const organization = await this.findOne(dto.id);
    if (!organization) throw new NotFoundException("Organization not found");

    this.organizationRepo.assign(organization, dto);
    await this.em.flush();
    return organization;
  }
}
