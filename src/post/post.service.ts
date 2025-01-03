import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma-client/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          published: createPostDto.published,
          author: {
            connect: {
              id: createPostDto.authorId,
            },
          },
          categories: {
            connectOrCreate: createPostDto.categories.map((category) => ({
              where: {
                name: category.name,
              },
              create: {
                name: category.name,
              },
            })),
          },
          createdAt: createPostDto.createdAt ?? new Date(),
        },
      });
      return post;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const posts = await this.prisma.post.findMany({
        include: {
          author: true,
        },
      });
      return posts;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          categories: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return post;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.prisma.post.update({
        where: {
          id: id,
        },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
          published: updatePostDto.published,
          categories: {
            connectOrCreate: updatePostDto.categories.map((category) => ({
              where: {
                name: category.name,
              },
              create: {
                name: category.name,
              },
            })),
          },
          updatedAt: new Date(),
        },
      });
      return post;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const post = await this.prisma.post.delete({
        where: {
          id: id,
        },
      });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return 'Post deleted successfully';
    } catch (error) {
      throw error;
    }
  }
}
