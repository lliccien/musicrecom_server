import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(201)
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 201,
    description: 'The user logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'The access token',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNGQ0MWRkZS1iNzFmLTQwNGMtOTgxNy0xNjY0M2QxOWNiNTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTY1MzA3NzgyNiwiZXhwIjoxNjUzMDgxNDI2fQ.KyJkitGJKS94aymnDtiPUUFEVVGbtAhkE9SYGMN2GBk',
        },
      },
    },
  })
  @ApiBody({
    type: CreateAuthDto,
    description: 'The user to sign in',
    examples: {
      user: {
        summary: 'The user to sign in',
        description: 'The user to sign in',
        value: {
          username: 'john_doe',
          password: '123456',
        },
      },
    },
  })
  signin(@Body() signin: CreateAuthDto) {
    return this.authService.signin(signin);
  }

  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Sign up user.' })
  @ApiResponse({
    status: 201,
    description: 'The user registered',
  })
  @ApiBody({
    type: CreateAuthDto,
    description: 'The user to sign up',
    examples: {
      user: {
        summary: 'The user to sign up',
        description: 'The user to sign up',
        value: {
          username: 'john_doe',
          password: '123456',
        },
      },
    },
  })
  signup(@Body() signup: CreateAuthDto) {
    return this.authService.signup(signup);
  }
}
