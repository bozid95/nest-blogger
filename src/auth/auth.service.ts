import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma-client/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnprocessableEntityException('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnprocessableEntityException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
      },
      {
        expiresIn: '1d',
        secret: this.configService.getOrThrow('JWT_SECRET'),
      },
    );

    return {
      status: 'success',
      data: { token },
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
