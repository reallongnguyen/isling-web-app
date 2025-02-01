export interface SignupInputDto {
  email: string;
  password: string;
}

export interface SignupOutputDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
  user: {
    id: string;
    email: string;
    phone: string;
  };
}
