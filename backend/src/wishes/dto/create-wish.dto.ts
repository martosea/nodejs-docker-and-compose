import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
