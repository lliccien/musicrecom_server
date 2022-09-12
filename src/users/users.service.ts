import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../shared/hashing.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const hashPassword = await this.hashingService.hash(password);
      const user = this.userRepository.create({
        password: hashPassword,
        ...userData,
      });
      await this.userRepository.save(user);
    } catch (e) {
      this.handleDBException(e);
    }
  }

  async findAll() {
    try {
      const users = this.userRepository.find();
      if (!users) throw new HttpException('Users not found', 404);
      return users;
    } catch (e) {
      this.handleDBException(e);
    }
  }

  async findOneByUsername(username: string) {
    try {
      const user = await this.userRepository.findOneBy({ username });

      if (!user) {
        throw new HttpException('User not found', 404);
      }
      return user;
    } catch (e) {
      this.handleDBException(e);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      if (!user) throw new HttpException('User not found', 404);
      return user;
    } catch (e) {
      this.handleDBException(e);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    if (updateUserDto.password && user.password !== updateUserDto.password) {
      user.password = await this.hashingService.hash(updateUserDto.password);
    }

    try {
      await this.userRepository.save(user);
      return user;
    } catch (e) {
      this.handleDBException(e);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (e) {
      this.handleDBException(e);
    }
  }

  private handleDBException(error: any) {
    this.logger.error(error);
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException();
  }
}
