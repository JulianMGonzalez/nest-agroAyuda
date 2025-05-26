import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileImageValidationPipe } from './pipes/filterFile';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { readFile } from 'fs';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.findProductImage(imageName)

    res.sendFile(path)
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/images/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductFIle(
    @UploadedFile(new FileImageValidationPipe()) file: Express.Multer.File,
  ) {
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      fileName: file.filename, // Nombre del archivo
      url: secureUrl, // URL para acceder al archivo
    };
  }
}
