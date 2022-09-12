import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import SpotifyWebApi from 'spotify-web-api-node';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { CacheService } from '../shared/cache.service';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger('SpotifyService');
  spotifyApi: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly cacheService: CacheService,
  ) {
    this.spotifyApi = this.getSpotify();

    this.setAccessToken();
  }

  async findTracksByUserGenres(userId: string) {
    // @ts-ignore
    const tracksCache: stirng[] | null = await this.cacheService.getFromCache(
      userId,
    );
    // @ts-ignore
    const genresCache: stirng[] | null = await this.cacheService.getFromCache(
      `${userId}-genres`,
    );
    const { genres } = await this.userService.findOne(userId);

    const compareGenres = this.compareGenresWithCache(genres, genresCache);

    if (tracksCache && genresCache && compareGenres) {
      this.logger.log('Response from cache');
      return SpotifyService.randomizeTracks(tracksCache);
    }

    const data = [];

    try {
      for (const genre of genres) {
        const response = await this.getTracksByGenre(genre);

        data.push(...response);
      }
      await this.cacheService.addToCache(`${userId}-genres`, genres);
      await this.cacheService.addToCache(userId, data);

      this.logger.log('Response from Spotify');

      return SpotifyService.randomizeTracks(data);
    } catch (e) {
      this.handleSpotifyException(e);
    }
  }

  async getAvailableGenreSeeds() {
    const genresCache = await this.cacheService.getFromCache('genres');
    if (genresCache) {
      this.logger.log('Response from cache');
      return genresCache;
    }
    try {
      const genres = await this.spotifyApi.getAvailableGenreSeeds();

      await this.cacheService.addToCache('genres', genres.body);
      this.logger.log('Response from Spotify');

      return genres.body;
    } catch (e) {
      this.handleSpotifyException(e);
    }
  }

  private getSpotify() {
    return new SpotifyWebApi({
      clientId: this.configService.get('clientId'),
      clientSecret: this.configService.get('clientSecret'),
    });
  }

  private setAccessToken() {
    this.spotifyApi.clientCredentialsGrant().then(
      (data) => {
        this.spotifyApi.setAccessToken(data.body['access_token']);
      },
      function (e) {
        this.handleSpotifyException(e);
      },
    );
  }

  private async getTracksByGenre(genre: string) {
    try {
      const response = await this.spotifyApi.searchTracks(`genre:${genre}`, {
        limit: 5,
        offset: 0,
      });
      return response.body.tracks.items;
    } catch (e) {
      this.handleSpotifyException(e);
    }
  }

  private handleSpotifyException(error: any) {
    this.logger.error(error);
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException();
  }

  private compareGenresWithCache(
    genres: string[],
    genresCache: string[] | undefined,
  ): boolean {
    if (!genresCache) return false;
    return genres.every((genre) => genresCache.includes(genre));
  }

  private static randomizeTracks(tracks: any[]) {
    return tracks[Math.floor(Math.random() * tracks.length)];
  }
}
