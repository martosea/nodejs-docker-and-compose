import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashModule } from '../hash/hash.module';
import { UsersModule } from '../users/users.module';
import { JwtConfigFactory } from '../config/jwt.config.factory';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    HashModule,
    UsersModule,
    JwtModule.registerAsync({
      useClass: JwtConfigFactory,
      inject: [],
      imports: [],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
