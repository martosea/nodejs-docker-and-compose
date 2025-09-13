import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from '../hash/hash.service';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserDto } from './dto/find-user.dto';

type UserView = {
  id: number;
  username: string;
  about: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

type Jsonifiable = { toJSON?: () => unknown };

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserView> {
    const { email, username, password, avatar, about } = createUserDto;
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({
      email,
      username,
      avatar,
      about,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return savedUser.toJSON() as UserView;
  }

  async findOne(query: string, includePassword: true): Promise<User>;
  async findOne(query: string, includePassword?: false): Promise<UserView>;
  async findOne(
    query: string,
    includePassword = false,
  ): Promise<User | UserView> {
    const user = await this.userRepository.findOne({
      where: { username: query },
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return includePassword ? user : (user.toJSON() as UserView);
  }

  async findMany(query: FindUserDto): Promise<UserView[]> {
    if (!query.query) return [];
    const users = await this.userRepository.find({
      where: [
        { username: ILike(`%${query.query}%`) },
        { email: ILike(`%${query.query}%`) },
      ],
    });
    return users.map((user) => user.toJSON() as UserView);
  }

  async findById(id: number): Promise<UserView> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.toJSON() as UserView;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserView> {
    const { password } = updateUserDto;
    if (password) {
      updateUserDto.password = await this.hashService.hashPassword(password);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async getOwnWishes(id: number): Promise<unknown[]> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
      ],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes.map((wish) => {
      const w = wish as unknown as Jsonifiable;
      return typeof w.toJSON === 'function' ? w.toJSON() : wish;
    });
  }

  async findWishes(username: string): Promise<unknown[]> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: [
        'wishes',
        'wishes.offers',
        'wishes.offers.item',
        'wishes.offers.user',
        'wishes.offers.item.owner',
      ],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes.map((wish) => {
      const w = wish as unknown as Jsonifiable;
      return typeof w.toJSON === 'function' ? w.toJSON() : wish;
    });
  }
}
