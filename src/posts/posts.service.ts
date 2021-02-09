import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async findAllByUser(userId: number): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      where: {
        userId,
      },
      order: {
        id: 'DESC',
      },
    });

    return posts;
  }

  async findById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      userId,
    });

    await this.postsRepository.save(post);

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    await this.findById(id);

    await this.postsRepository.update(id, updatePostDto);
  }

  async delete(id: number) {
    await this.findById(id);

    await this.postsRepository.delete(id);
  }
}
