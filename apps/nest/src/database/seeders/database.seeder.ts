import { EntityManager } from "@mikro-orm/core";
import { SchemaGenerator } from "@mikro-orm/postgresql";
import { Seeder } from "@mikro-orm/seeder";
import { geoSeeder } from "./geo.seeder";
import { orgPermissionsSeeder } from "./orgPermissions.seeder";
import { colorSeeder } from "./colors.seeder";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const schemaGenerator = new SchemaGenerator(em);

    /* -- REFRESHES DATABASE -- */
    if (process.env.NODE_ENV === "development")
      await schemaGenerator.refreshDatabase();
    /* ------------------------ */

    await colorSeeder(em);

    await orgPermissionsSeeder(em);

    await geoSeeder(em);

    await em.flush();
  }
}
