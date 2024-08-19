import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  CreateOrganizationDto,
  Organization,
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "shared-types";
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
    return await this.organizationRepo.findOne({ id });
  }

  async create(userId: string, dto: CreateOrganizationDto) {
    const existingOrganization = await this.organizationRepo.findOne({
      $or: [{ slug: dto.slug }, { document: dto.document }],
    });

    if (existingOrganization)
      throw new ConflictException({
        message: "Já existe uma organização com este slug.",
        property: "slug",
      });

    const organization = this.organizationRepo.create({
      ...dto,
      owner: userId,
    });

    await this.em.flush();
    return organization;
  }

  async update(dto: UpdateOrganizationDto, id?: string) {
    if (!id) throw new NotFoundException("ID não informado.");
    const organization = await this.findOne(id);
    if (!organization)
      throw new NotFoundException("Organização não encontrada.");

    const existingOrganization = await this.organizationRepo.findOne({
      $or: [{ slug: dto.slug }, { document: dto.document }],
      id: { $ne: id },
    });

    if (existingOrganization) {
      if (existingOrganization.slug === dto.slug) {
        throw new ConflictException({
          message: "Já existe uma organização com este slug.",
          property: "slug",
          activeOrg: id,
        });
      }
      if (existingOrganization.document === dto.document) {
        throw new ConflictException({
          message: "Já existe uma organização com este documento.",
          property: "document",
          activeOrg: id,
        });
      }
    }

    this.organizationRepo.assign(organization, dto);
    await this.em.flush();
    return organization;
  }

  async readUserOrganizations(userId: string) {
    return await this.organizationRepo.find({
      $or: [{ owner: userId }, { roles: { users: { $in: [userId] } } }],
    });
  }
}
