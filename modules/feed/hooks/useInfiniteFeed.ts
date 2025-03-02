import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedQueryParams, FeedResponse } from '../models';
import { useFeedService } from './useFeedService';

/**
 * Hook for fetching infinite feed data
 * @param params Query parameters
 * @returns Infinite query result with feed data
 */
export function useInfiniteFeed(params: FeedQueryParams = {}) {
  const { feedRepository, getFeedQueryKey } = useFeedService();

  return useInfiniteQuery({
    queryKey: getFeedQueryKey(params),
    queryFn: ({ pageParam }) => {
      // If pageParam is a number, use it as offset
      // If it's a string, use it as cursor
      // This handles both pagination types
      if (pageParam !== undefined) {
        if (typeof pageParam === 'number') {
          return feedRepository.getFeed({
            ...params,
            offset: pageParam,
          });
        } else {
          return feedRepository.getFeed({
            ...params,
            cursor: pageParam as string,
          });
        }
      }

      return feedRepository.getFeed(params);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: FeedResponse) => {
      if (!lastPage.hasMore) {
        return undefined;
      }

      // If nextCursor is a number string (from offset pagination), convert it to number
      if (lastPage.nextCursor && !isNaN(Number(lastPage.nextCursor))) {
        return Number(lastPage.nextCursor);
      }

      return lastPage.nextCursor;
    },
  });
}
