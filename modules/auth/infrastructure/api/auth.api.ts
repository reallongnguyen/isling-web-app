import { authAxios } from '@/modules/common/axios/axios-instance';
import { SignupInputDto, SignupOutputDto } from '../../models/signup.dto';
import { camelize } from '@/modules/common/util/object';
import { AuthToken } from '../../models/auth-token.model';
import { SigninInputDto, SigninOutputDto } from '../../models/signin.dto';

export async function signup(input: SignupInputDto) {
  return authAxios
    .post<SignupOutputDto>('/signup', input)
    .then((response) => camelize(response.data));
}

export async function signin(input: SigninInputDto) {
  return authAxios
    .post<SigninOutputDto>('/token?grant_type=password', input)
    .then((response) => camelize(response.data));
}

export async function refreshAuthToken(currentAuthToken: AuthToken) {
  return authAxios
    .post<AuthToken>('/token?grant_type=refresh_token', {
      refresh_token: currentAuthToken.refreshToken,
    })
    .then((response) =>
      AuthToken.fromSigninOutputDto(camelize(response.data) as SigninOutputDto)
    );
}

export async function logout(scope: 'local' | 'global' | 'others' = 'local') {
  return authAxios
    .post<SignupOutputDto>(`/logout?scope=${scope}`)
    .then((response) => camelize(response.data));
}
