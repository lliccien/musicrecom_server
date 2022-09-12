import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { SpotifyModule } from './spotify/spotify.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

import { config } from './configuration/config';
import { DatabaseConfig } from './configuration/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    UsersModule,
    SpotifyModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
