import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/common-entity';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends CommonEntity {
  @Column()
  @Length(0, 250, { message: 'Должно быть от 0 до 250 символов' })
  name: string;

  @Column({ nullable: true })
  @Length(1, 1024)
  @IsOptional()
  description: string;

  @Column({ default: CommonEntity.DEFAULT_AVATAR })
  @IsOptional()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsOptional()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
