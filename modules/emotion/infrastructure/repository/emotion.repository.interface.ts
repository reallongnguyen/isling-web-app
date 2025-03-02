import { CreateEmotionDto, Emotion } from '../../models';

/**
 * Interface for emotion repository
 */
export interface EmotionRepository {
  /**
   * Creates a new emotion
   * @param data Emotion data to create
   * @returns Created emotion
   */
  createEmotion(data: CreateEmotionDto): Promise<Emotion>;
}
