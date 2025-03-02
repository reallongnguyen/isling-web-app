import { EmotionApiRepository } from '../infrastructure';
import * as emotionApi from '../infrastructure/api/emotion.api';
import { CreateEmotionDto, Emotion } from '../models';

// Mock the emotion API
jest.mock('../infrastructure/api/emotion.api');

describe('EmotionApiRepository', () => {
  let repository: EmotionApiRepository;

  beforeEach(() => {
    repository = new EmotionApiRepository();
    jest.clearAllMocks();
  });

  describe('createEmotion', () => {
    it('should create an emotion successfully', async () => {
      // Arrange
      const createEmotionDto: CreateEmotionDto = {
        type: 'joy',
        note: 'Feeling happy!',
      };

      const mockResponse = {
        id: '123',
        type: 'joy',
        intensity: 1,
        timestamp: '2023-01-01T00:00:00Z',
        note: 'Feeling happy!',
      };

      (emotionApi.createEmotion as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await repository.createEmotion(createEmotionDto);

      // Assert
      expect(emotionApi.createEmotion).toHaveBeenCalledWith(createEmotionDto);
      expect(result).toBeInstanceOf(Emotion);
      expect(result.id).toBe('123');
      expect(result.type).toBe('joy');
      expect(result.intensity).toBe(1);
      expect(result.timestamp).toBe('2023-01-01T00:00:00Z');
      expect(result.note).toBe('Feeling happy!');
    });

    it('should handle errors when creating an emotion', async () => {
      // Arrange
      const createEmotionDto: CreateEmotionDto = {
        type: 'joy',
      };

      const mockError = new Error('API error');
      (emotionApi.createEmotion as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(repository.createEmotion(createEmotionDto)).rejects.toThrow(
        'API error'
      );
      expect(emotionApi.createEmotion).toHaveBeenCalledWith(createEmotionDto);
    });
  });
});
