import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishErrors, WishesLimits } from './wishes.constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  create(createWishDto: CreateWishDto, user: User): Promise<unknown> {
    return this.wishRepository.save({ ...createWishDto, owner: user });
  }

  async findById(id: number): Promise<unknown> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!wish) {
      throw new NotFoundException(WishErrors.NotFound);
    }

    return wish.toJSON();
  }

  async findLatestWishes(): Promise<unknown[]> {
    const wishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: WishesLimits.latest,
      relations: ['owner'],
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async findTopWishes(): Promise<unknown[]> {
    const wishes = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: WishesLimits.mostCopied,
      relations: ['owner'],
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async update(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<unknown> {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException(WishErrors.NotFound);
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(WishErrors.NotOwner);
    }

    const isPriceChanged =
      updateWishDto.price !== undefined && updateWishDto.price !== wish.price;
    const hasContributions = wish.raised > 0;

    if (isPriceChanged && hasContributions) {
      throw new BadRequestException(WishErrors.CannotChangePrice);
    }

    await this.wishRepository.update(wishId, updateWishDto);
    const updatedWish = await this.wishRepository.findOneBy({ id: wishId });

    if (!updatedWish) {
      throw new NotFoundException(WishErrors.NotFound);
    }

    return updatedWish.toJSON();
  }

  async remove(wishId: number, userId: number): Promise<unknown> {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException(WishErrors.NotFound);
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException(WishErrors.NotOwner);
    }

    await this.wishRepository.delete(wishId);
    return wish.toJSON();
  }

  async copy(wishId: number, user: User): Promise<unknown> {
    const originalWish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });

    if (!originalWish) {
      throw new NotFoundException(WishErrors.NotFound);
    }

    if (originalWish.owner.id === user.id) {
      throw new BadRequestException(WishErrors.OwnWishCopy);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wishRepo = queryRunner.manager.getRepository(Wish);

      const fresh = await wishRepo.findOneBy({ id: wishId });
      if (!fresh) {
        throw new NotFoundException(WishErrors.NotFound);
      }

      await wishRepo.update(wishId, { copied: fresh.copied + 1 });

      const newWish = await wishRepo.save({
        name: fresh.name,
        link: fresh.link,
        image: fresh.image,
        price: fresh.price,
        description: fresh.description,
        owner: user,
        raised: 0,
        copied: 0,
      });

      const savedWish = await wishRepo.findOne({
        where: { id: newWish.id },
        relations: ['owner'],
      });

      if (!savedWish) {
        throw new NotFoundException(WishErrors.NotFound);
      }

      await queryRunner.commitTransaction();
      return savedWish.toJSON();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getManyByIds(wishIds: number[]): Promise<unknown[]> {
    if (!wishIds.length) return [];
    const wishes = await this.wishRepository.find({
      where: { id: In(wishIds) },
    });

    return wishes.map((wish) => wish.toJSON());
  }

  async updateRaised(id: number, raisedAmount: number): Promise<unknown> {
    await this.wishRepository.update(id, { raised: raisedAmount });
    const updatedWish = await this.wishRepository.findOneBy({ id });
    if (!updatedWish) {
      throw new NotFoundException(WishErrors.NotFound);
    }
    return updatedWish.toJSON();
  }
}
