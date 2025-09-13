import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/common-entity';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsNumber, Min } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends CommonEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
