import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UseFilters,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { User } from '../users/entities/user.entity';
import { GetUser, GetUserId } from '../common/decorators/get-user.decorator';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { OfferInterceptor } from '../common/interceptors/offers.interceptor';
import { ValidationFilter } from '../common/filters/validation.filter';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(AuthGuardJwt)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ): Promise<unknown> {
    return this.wishesService.create(createWishDto, user);
  }

  @UseInterceptors(PasswordInterceptor)
  @Get('last')
  async findLatestWishes(): Promise<unknown[]> {
    return this.wishesService.findLatestWishes();
  }

  @UseInterceptors(PasswordInterceptor)
  @Get('top')
  async findTopWishes(): Promise<unknown[]> {
    return this.wishesService.findTopWishes();
  }

  @UseInterceptors(PasswordInterceptor, OfferInterceptor)
  @UseGuards(AuthGuardJwt)
  @Get(':id')
  async findWish(@Param('id', ParseIntPipe) id: number): Promise<unknown> {
    return this.wishesService.findById(id);
  }

  @UseInterceptors(PasswordInterceptor)
  @UseGuards(AuthGuardJwt)
  @Patch(':id')
  @UseFilters(ValidationFilter)
  async update(
    @Param('id', ParseIntPipe) wishId: number,
    @Body() updateWishDto: UpdateWishDto,
    @GetUserId() userId: number,
  ): Promise<unknown> {
    return this.wishesService.update(wishId, updateWishDto, userId);
  }

  @UseInterceptors(PasswordInterceptor)
  @UseGuards(AuthGuardJwt)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) wishId: number,
    @GetUserId() userId: number,
  ): Promise<unknown> {
    return this.wishesService.remove(wishId, userId);
  }

  @UseInterceptors(PasswordInterceptor)
  @UseGuards(AuthGuardJwt)
  @Post(':id/copy')
  async copy(
    @Param('id', ParseIntPipe) wishId: number,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.wishesService.copy(wishId, user);
  }
}
