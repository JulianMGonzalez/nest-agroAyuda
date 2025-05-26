import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  findProductImage(imageName: string){
    const path = join(__dirname, '../../static/images/products', imageName)

    if(!existsSync(path)){
      throw new BadRequestException(`No product found with image ${imageName}`)
    }

    return path
  }
}
