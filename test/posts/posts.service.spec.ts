import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { Post } from '../../src/posts/post.entity';
import { PostsRepository } from '../../src/posts/posts.repository';
import { PostsService } from '../../src/posts/posts.service';

const mockPost = (): Post => ({
  id: 1,
  content: 'anycontent',
  title: 'anytitle',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 1,
});

const mockCreatePostDto = (): CreatePostDto => ({
  content: 'anycontent',
  title: 'anytitle',
});

const mockUpdatePostDto = (): UpdatePostDto => ({
  content: 'anycontent',
  title: 'anytitle',
});

describe('PostsService', () => {
  let service: PostsService;
  let repository: PostsRepository;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PostsRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<PostsRepository>(PostsRepository);
  });

  describe('findAllByUser()', () => {
    it('should call PostsRepository find', async () => {
      const findSpy = jest.spyOn(repository, 'find');

      await service.findAllByUser(1);

      expect(findSpy).toHaveBeenCalled();
    });

    it('should throw if PostsRepository find throws', async () => {
      jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error());

      await expect(service.findAllByUser(1)).rejects.toThrow();
    });

    it('should return posts on success', async () => {
      const mockReturn: Post[] = [mockPost()];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockReturn);

      const response = await service.findAllByUser(1);

      expect(response).toEqual(mockReturn);
    });
  });

  describe('findById()', () => {
    it('should call PostsRepository find one with correct value', async () => {
      const findSpy = jest.spyOn(repository, 'findOne');

      findSpy.mockResolvedValueOnce(mockPost());

      const userId = 1;

      await service.findById(userId);

      expect(findSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if PostsRepository find one throws', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());

      const userId = 1;

      await expect(service.findById(userId)).rejects.toThrow();
    });

    it('should throw if PostsRepository find one returns null', async () => {
      const userId = 1;

      await expect(service.findById(userId)).rejects.toThrow();
    });

    it('should return post on success', async () => {
      const mockReturn = mockPost();

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockReturn);

      const response = await service.findById(1);

      expect(response).toEqual(mockReturn);
    });
  });

  describe('create()', () => {
    it('should call PostsRepository create with correct values', async () => {
      const mockCreateParam = mockCreatePostDto();

      const userId = 1;

      const createSpy = jest.spyOn(repository, 'create');

      await service.create(mockCreateParam, userId);

      expect(createSpy).toHaveBeenCalledWith({
        ...mockCreateParam,
        userId,
      });
    });

    it('should call PostsRepository save with correct values', async () => {
      const mockCreateParam = mockCreatePostDto();

      const userId = 1;

      const mockPostReturn = mockPost();

      jest.spyOn(repository, 'create').mockReturnValueOnce(mockPostReturn);

      const saveSpy = jest.spyOn(repository, 'save');

      await service.create(mockCreateParam, userId);

      expect(saveSpy).toHaveBeenCalledWith(mockPostReturn);
    });

    it('should throw if PostsRepository save throws', async () => {
      const mockCreateParam = mockCreatePostDto();

      const userId = 1;

      const mockPostReturn = mockPost();

      jest.spyOn(repository, 'create').mockReturnValueOnce(mockPostReturn);

      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error());

      await expect(service.create(mockCreateParam, userId)).rejects.toThrow();
    });

    it('should return user on success', async () => {
      const mockCreateParam = mockCreatePostDto();

      const userId = 1;

      const mockPostReturn = mockPost();

      jest.spyOn(repository, 'create').mockReturnValueOnce(mockPostReturn);

      const response = await service.create(mockCreateParam, userId);

      expect(response).toEqual(mockPostReturn);
    });
  });

  describe('update', () => {
    it('should call PostsRepository find one with correct value', async () => {
      const findSpy = jest.spyOn(repository, 'findOne');

      findSpy.mockResolvedValueOnce(mockPost());

      const userId = 1;
      const mockParam = mockUpdatePostDto();

      await service.update(userId, mockParam);

      expect(findSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if PostsRepository find one throws', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());

      const userId = 1;
      const mockParam = mockUpdatePostDto();

      await expect(service.update(userId, mockParam)).rejects.toThrow();
    });

    it('should throw if PostsRepository find one returns null', async () => {
      const userId = 1;
      const mockParam = mockUpdatePostDto();

      await expect(service.update(userId, mockParam)).rejects.toThrow();
    });

    it('should call PostsRepository update with correct values', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockPost());

      const updateSpy = jest.spyOn(repository, 'update');

      const userId = 1;
      const mockParam = mockUpdatePostDto();

      await service.update(userId, mockParam);

      expect(updateSpy).toHaveBeenCalledWith(userId, mockParam);
    });

    it('should throw if PostsRepository update throws', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockPost());

      jest.spyOn(repository, 'update').mockRejectedValueOnce(new Error());

      const userId = 1;
      const mockParam = mockUpdatePostDto();

      await expect(service.update(userId, mockParam)).rejects.toThrow();
    });
  });

  describe('delete()', () => {
    it('should call PostsRepository find one with correct value', async () => {
      const findSpy = jest.spyOn(repository, 'findOne');

      findSpy.mockResolvedValueOnce(mockPost());

      const userId = 1;

      await service.delete(userId);

      expect(findSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if PostsRepository find one throws', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());

      const userId = 1;

      await expect(service.delete(userId)).rejects.toThrow();
    });

    it('should throw if PostsRepository find one returns null', async () => {
      const userId = 1;

      await expect(service.delete(userId)).rejects.toThrow();
    });

    it('should call PostsRepository delete with correct value', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockPost());

      const deleteSpy = jest.spyOn(repository, 'delete');

      const userId = 1;

      await service.delete(userId);

      expect(deleteSpy).toHaveBeenCalledWith(userId);
    });

    it('should throw if PostsRepository delete throws', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockPost());

      jest.spyOn(repository, 'delete').mockRejectedValueOnce(new Error());

      const userId = 1;

      await expect(service.delete(userId)).rejects.toThrow();
    });
  });
});
