import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { CommonEntity } from '../../common/common-entity';

@Entity()
export class Wish extends CommonEntity {
  @Column()
  @Length(1, 250, { message: 'Должно быть от 1 до 250 символов' })
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, { eager: true })
  @JoinColumn()
  @IsNotEmpty()
  owner: User;

  @Column()
  @Length(1, 1024, { message: 'Описание должно быть от 1 до 1024 символов' })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  copied: number;
}
