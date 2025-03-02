import { EmotionResponseDto } from './emotion.dto';

/**
 * Represents an emotion created by a user
 */
export class Emotion {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly intensity: number,
    public readonly timestamp: string,
    public readonly note: string | null = null
  ) {}

  /**
   * Creates an Emotion instance from API response
   */
  static fromResponse(response: EmotionResponseDto): Emotion {
    return new Emotion(
      response.id,
      response.type,
      response.intensity,
      response.timestamp,
      response.note
    );
  }
}
