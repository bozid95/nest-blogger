import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true, example: 'example@mail.com' })
  email: string;
  @ApiProperty({ required: true, example: 'password' })
  password: string;
}
