// db.config.ts
import { PostgreSqlDriver, defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { SeedManager } from "@mikro-orm/seeder";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import "dotenv/config";

export default defineConfig({
  entities: ["./dist/**/*.{entity,entities}.js"],
  entitiesTs: ["./src/**/*.{entity,entities}.ts"],
  clientUrl: process.env.DATABASE_URL,
  metadataCache: {
    pretty: true,
    options: { cacheDir: "./src/database/store/metadata" },
  },
  seeder: {
    path: "./dist/database/seeders",
    pathTs: "./src/database/seeders",
    defaultSeeder: "DatabaseSeeder",
    glob: "*.seed!(*.d).{js,ts}",
    emit: "ts",
  },
  migrations: {
    path: "./dist/database/store/migrations",
    pathTs: "./src/database/store/migrations",
    tableName: "public.mikro_orm_migrations",
  },
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, SeedManager],
});
