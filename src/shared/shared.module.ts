import { CacheModule, Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { CacheService } from './cache.service';
import { ConfigModule } from '@nestjs/config';
import { CacheConfig } from '../configuration/cache.config';

@Module({
  providers: [HashingService, CacheService],
  exports: [HashingService, CacheService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfig,
    }),
  ],
})
export class SharedModule {}
