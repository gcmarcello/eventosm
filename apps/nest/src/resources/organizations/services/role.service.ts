import { Injectable } from "@nestjs/common";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateOrganizationRoleDto } from "../dto/role.dto";
import { OrganizationRole } from "../entities/organizationRole.entity";

@Injectable()
export class OrganizationRoleService {
  constructor(
    @InjectRepository(OrganizationRole)
    private organizationRepo: EntityRepository<OrganizationRole>,
    private em: EntityManager
  ) {}

  async create(organizationId: string, data: CreateOrganizationRoleDto) {
    const { name, permissions } = data;

    const organizationRole = this.em.create(OrganizationRole, {
      name,
      organization: organizationId,
      permissions,
    });

    await this.em.flush();

    return organizationRole;
  }
}
