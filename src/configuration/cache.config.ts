import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      host: this.configService.get('cache.host'),
      port: this.configService.get('cache.port'),
      ttl: this.configService.get('cache.ttl'),
    };
  }
}
