import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma-client/prisma.service';
import { Comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    if (!createCommentDto) {
      throw new BadRequestException('Comment data is required');
    }

    const { content, postId, authorId } = createCommentDto;

    if (!content || !postId || !authorId) {
      throw new BadRequestException('Missing required fields');
    }

    try {
      const [post, author] = await Promise.all([
        this.prisma.post.findUnique({
          where: { id: postId },
          select: { id: true },
        }),
        this.prisma.user.findUnique({
          where: { id: authorId },
          select: { id: true },
        }),
      ]);

      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      if (!author) {
        throw new NotFoundException(`Author with ID ${authorId} not found`);
      }

      return await this.prisma.comment.create({
        data: {
          content,
          post: { connect: { id: postId } },
          author: { connect: { id: authorId } },
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create comment: ${error.message}`,
      );
    }
  }

  async findAll() {
    return await this.prisma.comment.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
    return `This action updates a #${id} comment`;
  }

  async remove(id: string) {
    return await this.prisma.comment.delete({ where: { id } });
  }
}
