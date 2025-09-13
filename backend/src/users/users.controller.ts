import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { ValidationFilter } from '../common/filters/validation.filter';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';

@UseGuards(AuthGuardJwt)
@UseInterceptors(PasswordInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getOwn(@GetUserId() id: number): Promise<unknown> {
    return this.usersService.findById(id);
  }

  @Patch('me')
  @UseFilters(ValidationFilter)
  @HttpCode(HttpStatus.OK)
  async updateCurrentUser(
    @GetUserId() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<unknown> {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('me/wishes')
  async getOwnWishes(@GetUserId() id: number): Promise<unknown[]> {
    return this.usersService.getOwnWishes(id);
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<unknown> {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<unknown[]> {
    return this.usersService.findWishes(username);
  }

  @Post('find')
  @HttpCode(HttpStatus.OK)
  async findUsers(@Body() dto: FindUserDto): Promise<unknown[]> {
    return this.usersService.findMany(dto);
  }
}
