import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmailModule } from "./infrastructure/email/email.module";
import { SettingsModule } from "./settings/settings.module";
import { BullModule } from "./infrastructure/bull/bull.module";
import { QrCodeModule } from "./resources/qrcode/qrcode.module";
import { UploadsModule } from "./infrastructure/uploads/uploads.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { UserService } from "./resources/users/user.service";
import { UsersModule } from "./resources/users/users.module";
import { AuthModule } from "./resources/auth/auth.module";
import { AuthService } from "./resources/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseTimeInterceptor } from "./app.interceptor";
import { OrganizationModule } from "./resources/organizations/organization.module";
import { OrganizationService } from "./resources/organizations/services/organization.service";
import { OrganizationController } from "./resources/organizations/organization.controller";
import { UserController } from "./resources/users/user.controller";
import { GeoModule } from "./resources/geo/geo.module";
import { GeoService } from "./resources/geo/geo.service";
import { EventsModule } from "./resources/events/events.module";
import { OrganizationRoleService } from "./resources/organizations/services/role.service";

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
    UsersModule,
    GeoModule,
    EventsModule,
  ],
  controllers: [AppController, OrganizationController, UserController],
  providers: [
    AppService,
    UserService,
    AuthService,
    OrganizationService,
    JwtService,
    GeoService,
    OrganizationRoleService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor,
    },
  ],
})
export class AppModule {}
