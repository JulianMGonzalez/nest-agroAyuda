import { SetMetadata } from '@nestjs/common';
import { ValidateRoles } from '../interfaces/validate-roles';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidateRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
