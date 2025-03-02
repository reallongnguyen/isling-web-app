import { CreateEmotionDto, Emotion } from '../../models';
import { EmotionRepository } from './emotion.repository.interface';
import * as emotionApi from '../api/emotion.api';

/**
 * Implementation of EmotionRepository using API
 */
export class EmotionApiRepository implements EmotionRepository {
  /**
   * Creates a new emotion
   * @param data Emotion data to create
   * @returns Created emotion
   */
  async createEmotion(data: CreateEmotionDto): Promise<Emotion> {
    try {
      const response = await emotionApi.createEmotion(data);
      return Emotion.fromResponse(response);
    } catch (error) {
      console.error('Error creating emotion:', error);
      throw error;
    }
  }
}
