import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from './dtos/auth-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthResponseDto })
  async auth(@Body() authUserDto: AuthUserDto): Promise<AuthResponseDto> {
    return this.usersService.auth(authUserDto);
  }
}
