import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger('CacheService');

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToCache(key: string, value: any[]) {
    try {
      await this.cacheManager.set(key, value);
    } catch (e) {
      this.handleCacheException(e);
    }
  }

  async getFromCache(key: string) {
    try {
      return await this.cacheManager.get(key);
    } catch (e) {
      this.handleCacheException(e);
    }
  }

  private handleCacheException(error: any) {
    this.logger.error(error.detail);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs.',
    );
  }
}
