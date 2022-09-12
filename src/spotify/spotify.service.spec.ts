import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyService } from './spotify.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CacheService } from '../shared/cache.service';
import { HashingService } from '../shared/hashing.service';
import { CACHE_MANAGER } from '@nestjs/common';

describe('SpotifyService', () => {
  let service: SpotifyService;
  let configService: ConfigService;
  let userService: UsersService;
  let cacheService: CacheService;
  let hashingService: HashingService;

  const mockUserRepository = () => ({
    findOne: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotifyService,
        ConfigService,
        UsersService,
        CacheService,
        HashingService,
        {
          provide: 'SpotifyService',
          useValue: {
            findTracksByUserGenres: jest.fn().mockResolvedValue({}),
            getAvailableGenreSeeds: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: 'UserRepository',
          useFactory: mockUserRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue({}),
            set: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<SpotifyService>(SpotifyService);
    configService = module.get<ConfigService>(ConfigService);
    userService = module.get<UsersService>(UsersService);
    cacheService = module.get<CacheService>(CacheService);
    hashingService = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
