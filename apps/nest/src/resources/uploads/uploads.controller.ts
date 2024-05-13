import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { UploadsService } from "./uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query() query) {
    return await this.uploadsService.uploadFile(file, query.folder);
  }
}
