import { SigninOutputDto } from './signin.dto';
import { SignupOutputDto } from './signup.dto';

export class AuthToken {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly expiresAt: number,
    public readonly tokenType: string
  ) {}

  static fromSigninOutputDto(
    signupOutputDto: SignupOutputDto | SigninOutputDto
  ): AuthToken {
    return {
      accessToken: signupOutputDto.accessToken,
      refreshToken: signupOutputDto.refreshToken,
      expiresAt: signupOutputDto.expiresAt,
      tokenType: signupOutputDto.tokenType,
    };
  }
}
