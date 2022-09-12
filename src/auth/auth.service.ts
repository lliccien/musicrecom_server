import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { HashingService } from '../shared/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signin(signin: CreateAuthDto) {
    const valid = await this.validateUser(signin);
    if (!valid) throw new HttpException('User not found', 404);
    const payload = {
      sub: valid.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signup: CreateAuthDto) {
    await this.usersService.create({ ...signup, genres: [], role: 'user' });
  }

  async validateUser(auth: CreateAuthDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(auth.username);
    const validPassword = await this.hashingService.compare(
      auth.password,
      user.password,
    );
    if (user && validPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
