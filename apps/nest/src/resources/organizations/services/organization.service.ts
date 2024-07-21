import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateOrganizationDto,
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "shared-types";
import { Organization } from "../entities/organization.entity";
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

  async create(userId: string, dto: CreateOrganizationDto) {
    const organization = this.organizationRepo.create({
      ...dto,
      owner: userId,
    });

    await this.em.flush();
    return organization;
  }

  async update(dto: UpdateOrganizationDto) {
    const organization = await this.findOne(dto.id);
    if (!organization)
      throw new NotFoundException("Organização não encontrada.");

    const existingOrganization = await this.organizationRepo.findOne({
      $or: [{ slug: dto.slug }, { document: dto.document }],
      id: { $ne: dto.id },
    });

    if (existingOrganization) {
      if (existingOrganization.slug === dto.slug) {
        throw new ConflictException({
          message: "Já existe uma organização com este slug.",
          field: "slug",
        });
      }
      if (existingOrganization.document === dto.document) {
        throw new ConflictException({
          message: "Já existe uma organização com este documento.",
          field: "document",
        });
      }
    }

    this.organizationRepo.assign(organization, dto);
    await this.em.flush();
    return organization;
  }
}
