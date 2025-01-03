import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @ApiProperty({ required: true, example: 'title' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required' })
  @ApiProperty({ required: true, example: 'content' })
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, example: true })
  published?: boolean = false;

  @IsUUID()
  @IsNotEmpty({ message: 'Author is required' })
  @ApiProperty({ required: true, example: 'uuid' })
  authorId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  @ApiProperty({ type: [CreateCategoryDto], example: [{ name: 'Tech' }] })
  categories: CreateCategoryDto[];

  @IsOptional()
  @Type(() => Date)
  createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  updatedAt?: Date;
}
