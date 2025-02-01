export interface SigninInputDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface SigninOutputDto {
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
