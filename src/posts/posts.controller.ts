import {
  Body,
  Controller,
  Get,
  Request,
  UseGuards,
  Post,
  Put,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './post.entity';
import { PostsService } from './posts.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Request() request): Promise<PostEntity[]> {
    const { userId } = request.user;

    return this.postsService.findAllByUser(userId);
  }

  @Get('/:id')
  async findById(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findById(id);
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() request,
  ): Promise<PostEntity> {
    const { userId } = request.user;

    return this.postsService.create(createPostDto, userId);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    await this.postsService.update(id, updatePostDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.postsService.delete(id);
  }
}
