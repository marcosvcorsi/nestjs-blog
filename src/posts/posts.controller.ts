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
import {
  ApiTags,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(PostDto) } },
  })
  async findAll(@Request() request): Promise<PostDto[]> {
    const { userId } = request.user;

    return this.postsService.findAllByUser(userId);
  }

  @Get('/:id')
  @ApiOkResponse({ type: PostDto })
  async findById(@Param('id') id: number): Promise<PostDto> {
    return this.postsService.findById(id);
  }

  @Post()
  @ApiCreatedResponse({ type: PostDto })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() request,
  ): Promise<PostDto> {
    const { userId } = request.user;

    return this.postsService.create(createPostDto, userId);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    await this.postsService.update(id, updatePostDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async delete(@Param('id') id: number) {
    await this.postsService.delete(id);
  }
}
