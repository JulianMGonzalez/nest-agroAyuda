import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import { LoginUserDto } from './dto/login-user.dto';

import { hashSync, compareSync } from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userRest } = createAuthDto;
      const user = this.authRepository.create({
        ...userRest,
        password: hashSync(password, 10),
      });

      await this.authRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUser: LoginUserDto) {
    const { email, password } = loginUser;

    const user = await this.authRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const isUser = compareSync(password, user.password);
    if (!isUser) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    const tokenUser = this.getJwtToken({ id: user.id });
    return {
      ...user,
      accessToken: tokenUser,
    };
  }

  async checkStatus(userLogin: User) {
    const { id } = userLogin;

    const tokenUser = this.getJwtToken({ id });
    return {
      ...userLogin,
      accessToken: tokenUser,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
