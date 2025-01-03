import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma-client/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new category.
   * @param createCategoryDto - DTO for creating a category.
   * @returns The newly created category.
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const category = await this.prismaService.category.create({
      data: {
        name,
      },
    });

    return category;
  }

  /**
   * Retrieve all categories.
   * @returns A list of all categories.
   */
  async findAll() {
    return this.prismaService.category.findMany();
  }

  /**
   * Retrieve a single category by its ID.
   * @param id - The ID of the category.
   * @returns The category if found.
   * @throws NotFoundException if the category is not found.
   */
  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Update a category by its ID.
   * @param id - The ID of the category to update.
   * @param updateCategoryDto - DTO for updating the category.
   * @returns The updated category.
   * @throws NotFoundException if the category is not found.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  /**
   * Delete a category by its ID.
   * @param id - The ID of the category to delete.
   * @returns The deleted category.
   * @throws NotFoundException if the category is not found.
   */
  async remove(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
