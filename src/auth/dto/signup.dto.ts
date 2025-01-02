import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 20, {
    message: 'Name must be between 3 and 20 characters',
  })
  @ApiProperty({ required: true, example: 'Widodo' })
  name: string;

  @IsEmail({}, { message: 'Invalid Email' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ required: true, example: 'example@mail.com' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  @ApiProperty({ required: true, example: 'passwordd' })
  password: string;
}
