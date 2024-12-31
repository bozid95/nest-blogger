import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(Role, { message: 'Invalid Role' })
  @IsNotEmpty()
  @ApiProperty({ required: true, enum: Role })
  role: Role;
}
