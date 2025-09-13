import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/common-entity';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true, length: 30 })
  @IsNotEmpty({ message: 'Это обязательное поле' })
  @Length(2, 30, { message: 'Должно быть от 2 до 30 символов' })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @Length(2, 200, { message: 'Должно быть от 2 до 200 символов' })
  about: string;

  @Column({ default: CommonEntity.DEFAULT_AVATAR })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Exclude()
  @Column()
  @IsNotEmpty()
  @MinLength(2, { message: 'Минимум 2 символа' })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  toJSON() {
    const obj = super.toJSON();
    delete obj.password;
    delete obj.email;
    return obj;
  }
}
