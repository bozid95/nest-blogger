import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationDto } from './dto/pagination.dto';
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
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    // Menghitung skip (jumlah data yang dilewati berdasarkan page)
    const skip = (page - 1) * limit;

    // Pastikan limit dan skip sudah terdefinisi
    const posts = await this.prisma.post.findMany({
      take: limit, // Membatasi jumlah data yang diambil
      orderBy: {
        createdAt: 'desc', // Urutkan berdasarkan createdAt
      },
      include: {
        author: true, // Menyertakan data author
        categories: true, // Menyertakan data categories
      },
      skip,
    });

    // Hitung total jumlah data untuk pagination
    const total = await this.prisma.post.count();

    // Kembalikan data dan meta informasi untuk pagination
    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
        nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };
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
