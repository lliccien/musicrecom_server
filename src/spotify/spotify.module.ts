import { CacheModule, Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { SharedModule } from '../shared/shared.module';
import { HashingService } from '../shared/hashing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CacheService } from '../shared/cache.service';
import { ConfigModule } from '@nestjs/config';
import { CacheConfig } from '../configuration/cache.config';

@Module({
  controllers: [SpotifyController],
  providers: [SpotifyService, UsersService, HashingService, CacheService],
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    SharedModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfig,
    }),
  ],
})
export class SpotifyModule {}
