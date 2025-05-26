import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileImageValidationPipe implements PipeTransform {
    transform(file: Express.Multer.File, metadata: ArgumentMetadata) {

        const kbLimited = 1000000;

        if (!file) throw new BadRequestException(`No existe el archivo`)

        const validExtensions = ['jpg', 'jpeg', 'png', 'gif']

        const imageExtension = file.mimetype.split('/')[1]

        if (!validExtensions.includes(imageExtension)) {
            throw new BadRequestException(`${file.originalname} file type not allowed`)
        }

        if (file.size > kbLimited) {
            throw new BadRequestException(`${file.originalname} has a weight greater than one megabyte`)
        }

        return file
    }
}