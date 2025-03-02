/**
 * DTO for creating an emotion
 */
export interface CreateEmotionDto {
  type: 'joy' | 'sadness' | 'anger' | 'fear' | 'joker';
  note?: string | null;
}

/**
 * DTO for emotion API response
 */
export interface EmotionResponseDto {
  id: string;
  type: string;
  intensity: number;
  timestamp: string;
  note: string | null;
}
