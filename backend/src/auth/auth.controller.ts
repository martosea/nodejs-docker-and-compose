import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuardLocal } from '../common/guards/auth-guard-local.service';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { ValidationFilter } from '../common/filters/validation.filter';

type AuthResponse = { access_token: string };

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuardLocal)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@GetUserId() userId: number): Promise<AuthResponse> {
    return this.authService.signIn(userId);
  }

  @Post('signup')
  @UseFilters(ValidationFilter)
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<unknown> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error: any) {
      const code = error?.code ?? error?.driverError?.code;
      if (code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username уже существует',
        );
      }
      throw error;
    }
  }
}
