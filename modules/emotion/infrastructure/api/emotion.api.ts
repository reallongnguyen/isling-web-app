import { apiAxios } from '@/modules/common/axios/axios-instance';
import { CreateEmotionDto, EmotionResponseDto } from '../../models';

/**
 * Creates a new emotion
 * @param data Emotion data to create
 * @returns Created emotion response
 */
export async function createEmotion(
  data: CreateEmotionDto
): Promise<EmotionResponseDto> {
  return apiAxios
    .post<EmotionResponseDto>('/v1/emotions', data)
    .then((response) => response.data);
}
