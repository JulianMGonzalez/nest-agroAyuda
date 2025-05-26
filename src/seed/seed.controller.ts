import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidateRoles } from 'src/auth/interfaces/validate-roles';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth(ValidateRoles.superAdmin)
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
