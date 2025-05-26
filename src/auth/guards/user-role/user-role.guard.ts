import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {


  constructor(private readonly reflector: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const handler = context.getHandler();
    const classRef = context.getClass();

    // Buscar metadatos tanto a nivel de método como de clase
    const rolesInMetadata = this.reflector.get<string[]>(META_ROLES, handler) 
                         ?? this.reflector.get<string[]>(META_ROLES, classRef);

    if (!rolesInMetadata || rolesInMetadata.length === 0) {
      return true; // No hay roles requeridos, acceso permitido
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;


    if (!user)
        throw new InternalServerErrorException('User not found in request');
  

    console.log(rolesInMetadata);
    for (const role of user.roles) {
      if (rolesInMetadata.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.full_name} need a valid role: [${rolesInMetadata}]`,
    );
  }
}
