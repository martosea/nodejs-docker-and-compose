import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { PasswordInterceptor } from '../common/interceptors/password.interceptor';
import { AuthGuardJwt } from '../common/guards/auth-guard-jwt.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseInterceptors(PasswordInterceptor)
@UseGuards(AuthGuardJwt)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createOfferDto: CreateOfferDto,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  getOffers(): Promise<unknown[]> {
    return this.offersService.getOffers();
  }

  @Get(':id')
  getOffer(@Param('id', ParseIntPipe) id: number): Promise<unknown> {
    return this.offersService.getOffer(id);
  }
}
