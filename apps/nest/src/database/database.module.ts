// database.module.ts
import { MikroOrmMiddleware, MikroOrmModule } from "@mikro-orm/nestjs";
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SettingsService } from "@/resources/settings/settings.service";
import dbConfig from "./db.config";

@Module({
  controllers: [],
  providers: [],
  imports: [MikroOrmModule.forRoot(dbConfig)],
})
export class DatabaseModule implements NestModule, OnModuleInit {
  constructor(
    private readonly orm: MikroORM<PostgreSqlDriver>,
    private readonly settings: SettingsService
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.settings.isProduction) {
      const migrator = this.orm.getMigrator();
      const entityManager = this.orm.em;

      entityManager.execute(`CREATE EXTENSION IF NOT EXISTS "unaccent";`);

      try {
        await migrator.createInitialMigration();
      } catch (err) {
        await migrator.createMigration();
      }

      await migrator.up();
    }

    if (!this.settings.isProduction) {
      const generator = this.orm.schema;
      try {
        await generator.updateSchema();
      } catch (err) {
        await generator.refreshDatabase();
      }
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MikroOrmMiddleware).forRoutes("*");
  }
}
