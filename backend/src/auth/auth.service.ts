import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOne(username, true);

    if (!user) {
      throw new UnauthorizedException('Username or password is invalid');
    }

    const isMatch = await this.hashService.verifyPassword(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Username or password is invalid');
    }

    return user;
  }

  async signIn(userId: number) {
    const payload = { sub: userId };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
