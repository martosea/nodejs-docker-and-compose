import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';
import { Type } from 'class-transformer';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  raised: number;
}
