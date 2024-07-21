import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json } from "express";
import { CustomValidationPipe } from "./pipes/customValidation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
    })
  );
  app.use(json({ limit: "50mb" }));
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
