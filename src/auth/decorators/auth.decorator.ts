import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ValidateRoles } from '../interfaces/validate-roles';
import { META_ROLES, RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidateRoles[]) {
  return applyDecorators(

    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard),
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}