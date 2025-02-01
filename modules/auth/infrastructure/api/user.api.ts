import { apiAxios } from '@/modules/common/axios/axios-instance';
import { UpsertUserInput } from '../../models/upsert-user.dto';
import { Profile } from '../../models/profile.model';

export async function upsertUser(input: UpsertUserInput) {
  return apiAxios.post<Profile>('/v1/users', input).then((res) => res.data);
}
