import { IsNumber, IsBoolean, IsOptional, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
