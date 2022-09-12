import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Spotify')
@Controller('spotify')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('tracks/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all buckets by owner Id.' })
  @ApiResponse({
    status: 200,
    description: 'The array of tracks by genres',
    schema: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  })
  @ApiParam({
    name: 'userId',
    format: 'uui',
    description: 'user id',
    required: true,
    example: 'b93a03e6-c371-4865-960f-4cfbd36ef7e9',
  })
  findTracksByGenres(@Param('userId') userId: string) {
    return this.spotifyService.findTracksByUserGenres(userId);
  }

  @Get('genres')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all Genres.' })
  @ApiResponse({
    status: 200,
    description: 'The found users',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: ['rock', 'pop', 'jazz'],
    },
  })
  getAvailableGenreSeeds() {
    return this.spotifyService.getAvailableGenreSeeds();
  }
}
