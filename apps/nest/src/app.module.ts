import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmailModule } from "./resources/email/email.module";
import { SettingsModule } from "./resources/settings/settings.module";
import { BullModule } from "./resources/bull/bull.module";
import { QrCodeModule } from "./resources/qrcode/qrcode.module";
import { UploadsModule } from "./resources/uploads/uploads.module";
import { DatabaseModule } from "./database/database.module";
import { UserService } from "./resources/users/user.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./resources/users/users.module";
import { join } from "path";
import { AuthModule } from "./resources/auth/auth.module";
import { AuthService } from "./resources/auth/auth.service";

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    BullModule,
    SettingsModule,
    QrCodeModule,
    EmailModule,
    UploadsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
