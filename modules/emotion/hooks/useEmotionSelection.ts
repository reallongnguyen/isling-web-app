import { useCallback, useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { emotionTypeAtom } from '../store';
import { useEmotionService } from './useEmotionService';
import { CreateEmotionDto } from '../models';
import { Toast } from 'antd-mobile';

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 500;

/**
 * Custom hook for emotion selection with debouncing
 * @returns Emotion selection utilities
 */
export function useEmotionSelection() {
  const [emotion, setEmotion] = useAtom(emotionTypeAtom);
  const { createEmotion, isCreating, error } = useEmotionService();
  const [localLoading, setLocalLoading] = useState<Record<string, boolean>>({});
  const [debouncedEmotion, setDebouncedEmotion] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Use a ref to track if an emotion is currently being saved
  const isSavingRef = useRef(false);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      Toast.show({
        content: 'Failed to save emotion. Please try again.',
        position: 'bottom',
      });
      // Reset saving state on error
      isSavingRef.current = false;
    }
  }, [error]);

  // Handle debounced emotion changes
  useEffect(() => {
    if (
      debouncedEmotion &&
      debouncedEmotion !== 'neutral' &&
      !isSavingRef.current
    ) {
      const saveEmotion = async () => {
        // Set saving flag to prevent duplicate requests
        isSavingRef.current = true;

        try {
          const emotionData: CreateEmotionDto = {
            type: debouncedEmotion as CreateEmotionDto['type'],
          };

          await createEmotion(emotionData);
        } catch (err) {
          console.error('Error creating emotion:', err);
        } finally {
          setLocalLoading((prev) => ({ ...prev, [debouncedEmotion]: false }));
          // Reset saving flag after completion
          isSavingRef.current = false;
        }
      };

      saveEmotion();
    }
  }, [debouncedEmotion]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  /**
   * Handle emotion change with debouncing
   * @param newEmotion New emotion to set
   */
  const handleEmotionChange = useCallback(
    (newEmotion: string) => {
      // If clicking the same emotion, reset to neutral (locally only)
      if (emotion === newEmotion) {
        setEmotion('neutral');
        setDebouncedEmotion(null);

        // Clear any pending debounce
        if (debounceTimer) {
          clearTimeout(debounceTimer);
          setDebounceTimer(null);
        }

        return;
      }

      // Set optimistic UI update
      setEmotion(newEmotion);

      // Set local loading state for this specific emotion
      setLocalLoading((prev) => ({ ...prev, [newEmotion]: true }));

      // Clear any pending debounce
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(() => {
        setDebouncedEmotion(newEmotion);
      }, DEBOUNCE_DELAY);

      setDebounceTimer(timer);
    },
    [emotion, setEmotion, debounceTimer]
  );

  return {
    emotion,
    handleEmotionChange,
    isLoading: (emotionValue: string) =>
      localLoading[emotionValue] || (isCreating && emotion === emotionValue),
  };
}
