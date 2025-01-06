import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 10,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }
}
