import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/interfaces/role.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
@Roles(Role.ADMIN)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create user.' })
  @ApiResponse({
    status: 201,
    description: 'The user created',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'The user to create',
    examples: {
      user: {
        summary: 'The user to create',
        description: 'The user to create',
        value: {
          username: 'john_doe',
          password: '123456',
        },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({
    status: 200,
    description: 'The found users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'b93a03e6-c371-4865-960f-4cfbd36ef7e9',
          },
          username: {
            type: 'string',
            example: 'john_doe',
          },
          password: {
            type: 'string',
          },
          genres: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['rock', 'pop', 'jazz'],
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user',
          },
        },
      },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user by Id.' })
  @ApiResponse({
    status: 200,
    description: 'The found user',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: 'b93a03e6-c371-4865-960f-4cfbd36ef7e9',
        },
        username: {
          type: 'string',
          example: 'john_doe',
        },
        password: {
          type: 'string',
        },
        genres: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['rock', 'pop', 'jazz'],
        },
        role: {
          type: 'string',
          enum: ['user', 'admin'],
          example: 'user',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'User id',
    required: true,
    example: 'b93a03e6-c371-4865-960f-4cfbd36ef7e9',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update user by Id.' })
  @ApiResponse({
    status: 204,
    description: 'The user updated',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'User id',
    required: true,
    example: 'b93a03e6-c371-4865-960f-4cfbd36ef7e9',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'The user to update',
    examples: {
      user: {
        summary: 'The user to update',
        description: 'The user to update',
        value: {
          password: '123456',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user by Id.' })
  @ApiResponse({
    status: 204,
    description: 'The user deleted',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'User id',
    required: true,
    example: '11ef58a3-9eef-4254-9beb-d1e6485c8cbc',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
