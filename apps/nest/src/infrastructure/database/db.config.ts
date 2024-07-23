// db.config.ts
import { PostgreSqlDriver, defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { SeedManager } from "@mikro-orm/seeder";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import "dotenv/config";
import { Entities } from "./entities";

export default defineConfig({
  entities: Entities,
  clientUrl: process.env.DATABASE_URL,
  metadataCache: {
    pretty: true,
    options: { cacheDir: "./src/infrastructure/database/store/metadata" },
  },
  seeder: {
    path: "./dist/infrastructure/database/seeders",
    pathTs: "./src/infrastructure/database/seeders",
    defaultSeeder: "DatabaseSeeder",
    glob: "*.seed!(*.d).{js,ts}",
    emit: "ts",
  },
  migrations: {
    path: "./dist/infrastructure/database/store/migrations",
    pathTs: "./src/infrastructure/database/store/migrations",
    tableName: "public.mikro_orm_migrations",
  },
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, SeedManager],
});
