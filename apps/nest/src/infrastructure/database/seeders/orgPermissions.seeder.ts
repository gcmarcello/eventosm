import { EntityManager } from "@mikro-orm/core";
import { OrganizationPermission, OrganizationPermissions } from "shared-types";

export async function orgPermissionsSeeder(em: EntityManager) {
  const permissions = Object.values(OrganizationPermissions);

  for (const permission of permissions) {
    const entity = em.create(OrganizationPermission, {
      permission: permission,
    });
    em.persist(entity);
  }
}
