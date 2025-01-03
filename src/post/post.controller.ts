import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';

@Controller('post')
@ApiTags('Posts')
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiQuery({
    name: 'page', // Nama parameter query
    required: false, // Menandakan parameter ini opsional
    description: 'Page number for pagination', // Deskripsi untuk dokumentasi
    type: Number, // Tipe data parameter
    example: 1, // Nilai contoh
  })
  @ApiQuery({
    name: 'limit', // Nama parameter query
    required: false, // Menandakan parameter ini opsional
    description: 'Number of items per page', // Deskripsi untuk dokumentasi
    type: Number, // Tipe data parameter
    example: 10, // Nilai contoh
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
