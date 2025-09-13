import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<unknown> {
    const { itemId, amount } = createOfferDto;

    const wish = await this.wishesService.findById(itemId);
    if (!wish) {
      throw new NotFoundException('Предложение не найдено');
    }

    if ((wish as any).owner.id === user.id) {
      throw new BadRequestException(
        'Вы не можете заплатить за свое собственное желание',
      );
    }

    const currentRaised = Number((wish as any).raised);
    const price = Number((wish as any).price);
    const offerAmount = Number(amount);
    const totalRaised = Number((currentRaised + offerAmount).toFixed(2));

    if (totalRaised > price) {
      throw new BadRequestException(
        'Сумма предложения превышает оставшуюся сумму',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const offerRepo = queryRunner.manager.getRepository(Offer);
      const wishRepo = queryRunner.manager.getRepository(Wish);

      const offer = await offerRepo.save({
        ...createOfferDto,
        user,
        item: wish as any,
      });

      await wishRepo.update(itemId, { raised: totalRaised });

      await queryRunner.commitTransaction();
      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getOffer(id: number): Promise<unknown> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    return offer.toJSON();
  }

  async getOffers(): Promise<unknown[]> {
    const offers = await this.offerRepository.find({
      relations: ['item', 'user'],
    });

    return offers.map((offer) => offer.toJSON());
  }
}
