import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @ApiProperty({ required: true, example: 'Comment' })
  content: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Post is required' })
  @ApiProperty({ required: true, example: 'uuid' })
  postId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'Author is required' })
  @ApiProperty({ required: true, example: 'uuid' })
  authorId: string;
}
