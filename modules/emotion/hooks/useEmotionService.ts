import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEmotionDto, Emotion } from '../models';
import { EmotionApiRepository } from '../infrastructure';
import { useState } from 'react';

/**
 * Hook for emotion service
 */
export function useEmotionService() {
  const queryClient = useQueryClient();
  const [repository] = useState(() => new EmotionApiRepository());

  const createEmotionMutation = useMutation({
    mutationFn: (data: CreateEmotionDto) => repository.createEmotion(data),
    onSuccess: () => {
      // Invalidate relevant queries when a new emotion is created
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
    },
  });

  /**
   * Creates a new emotion
   * @param data Emotion data to create
   * @returns Promise with created emotion
   */
  const createEmotion = async (data: CreateEmotionDto): Promise<Emotion> => {
    return createEmotionMutation.mutateAsync(data);
  };

  return {
    createEmotion,
    isCreating: createEmotionMutation.isPending,
    error: createEmotionMutation.error,
  };
}
