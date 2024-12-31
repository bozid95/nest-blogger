import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  signIn(signInDto: SignInDto) {
    return signInDto;
  }
  signUp(signUpDto: SignUpDto) {
    return signUpDto;
  }
}
