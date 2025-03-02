import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedApiRepository } from '../infrastructure';
import {
  CreatePostDto,
  FeedItem,
  FeedQueryParams,
  FeedResponse,
} from '../models';

/**
 * Feed service hook keys
 */
export const FEED_KEYS = {
  all: ['feeds'] as const,
  lists: () => [...FEED_KEYS.all, 'list'] as const,
  list: (params: FeedQueryParams) => [...FEED_KEYS.lists(), params] as const,
  details: () => [...FEED_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...FEED_KEYS.details(), id] as const,
};

/**
 * Feed service hook
 * @returns Feed service methods and state
 */
export function useFeedService() {
  const queryClient = useQueryClient();
  const feedRepository = new FeedApiRepository();
  const [error, setError] = useState<Error | null>(null);

  /**
   * Get feed query key
   * @param params Query parameters
   * @returns Query key
   */
  const getFeedQueryKey = useCallback(
    (params: FeedQueryParams = {}) => FEED_KEYS.list(params),
    []
  );

  /**
   * Create post mutation
   */
  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostDto) => feedRepository.createPost(data),
    onSuccess: () => {
      // Invalidate feed queries to refetch
      queryClient.invalidateQueries({ queryKey: FEED_KEYS.lists() });
    },
    onError: (err: Error) => {
      setError(err);
    },
  });

  /**
   * Create a new post
   * @param data Post data
   * @returns Promise with created feed item
   */
  const createPost = useCallback(
    async (data: CreatePostDto) => {
      try {
        setError(null);
        return await createPostMutation.mutateAsync(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error occurred'));
        }
        throw err;
      }
    },
    [createPostMutation]
  );

  /**
   * Like feed item mutation
   */
  const likeMutation = useMutation({
    mutationFn: (id: string) => feedRepository.likeFeedItem(id),
    onSuccess: (updatedItem) => {
      // Update item in cache
      queryClient.setQueryData(FEED_KEYS.detail(updatedItem.id), updatedItem);

      // Update item in feed lists
      queryClient.setQueriesData(
        { queryKey: FEED_KEYS.lists() },
        (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((item: FeedItem) =>
              item.id === updatedItem.id ? updatedItem : item
            ),
          };
        }
      );
    },
    onError: (err: Error) => {
      setError(err);
    },
  });

  /**
   * Unlike feed item mutation
   */
  const unlikeMutation = useMutation({
    mutationFn: (id: string) => feedRepository.unlikeFeedItem(id),
    onSuccess: (updatedItem) => {
      // Update item in cache
      queryClient.setQueryData(FEED_KEYS.detail(updatedItem.id), updatedItem);

      // Update item in feed lists
      queryClient.setQueriesData(
        { queryKey: FEED_KEYS.lists() },
        (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((item: FeedItem) =>
              item.id === updatedItem.id ? updatedItem : item
            ),
          };
        }
      );
    },
    onError: (err: Error) => {
      setError(err);
    },
  });

  /**
   * Like a feed item
   * @param id Feed item ID
   * @returns Promise with updated feed item
   */
  const likeFeedItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        return await likeMutation.mutateAsync(id);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error occurred'));
        }
        throw err;
      }
    },
    [likeMutation]
  );

  /**
   * Unlike a feed item
   * @param id Feed item ID
   * @returns Promise with updated feed item
   */
  const unlikeFeedItem = useCallback(
    async (id: string) => {
      try {
        setError(null);
        return await unlikeMutation.mutateAsync(id);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error occurred'));
        }
        throw err;
      }
    },
    [unlikeMutation]
  );

  return {
    getFeedQueryKey,
    feedRepository,
    createPost,
    likeFeedItem,
    unlikeFeedItem,
    isCreatingPost: createPostMutation.isPending,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
    error,
  };
}
