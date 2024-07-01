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
import { JwtService } from "@nestjs/jwt";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseTimeInterceptor } from "./app.interceptor";
import { OrganizationModule } from "./resources/organizations/organization.module";
import { OrganizationService } from "./resources/organizations/services/organization.service";

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    BullModule,
    SettingsModule,
    OrganizationModule,
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
  providers: [
    AppService,
    UserService,
    AuthService,
    OrganizationService,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor,
    },
  ],
})
export class AppModule {}
