import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/shared/services/hash.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { AuthUserDto } from './dtos/auth-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;

    const userByEmail = await this.usersRepository.findByEmail(email);

    if (userByEmail) {
      throw new BadRequestException('E-mail already exists');
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = this.usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async auth(authUserDto: AuthUserDto): Promise<AuthResponseDto> {
    const { email, password } = authUserDto;

    const user = await this.usersRepository.findByEmail(email);

    if (!user || !(await this.hashService.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail or password does not match');
    }

    const token = this.jwtService.sign({ userId: user.id });

    return { token };
  }
}
