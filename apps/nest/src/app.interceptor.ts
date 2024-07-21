import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SettingsService } from "./settings/settings.service";

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  constructor(private settingsService: SettingsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.settingsService.isProduction) return next.handle();
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Response time: ${Date.now() - now}ms`)));
  }
}
