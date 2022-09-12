import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return {
      secret: config.get('jwtSecret'),
      signOptions: { expiresIn: config.get('jwtExpireIn') },
    };
  },
};
