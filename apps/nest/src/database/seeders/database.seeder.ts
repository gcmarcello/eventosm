import {
  OrganizationPermission,
  OrganizationPermissions,
} from "@/resources/organizations/entities/organizationPermission.entity";
import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const permissions = Object.values(OrganizationPermissions);

    for (const permission of permissions) {
      const entity = em.create(OrganizationPermission, {
        permission: permission,
      });
      em.persist(entity);
    }

    await em.flush();
  }
}
