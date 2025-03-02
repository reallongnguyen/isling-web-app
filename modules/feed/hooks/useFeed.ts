import { useQuery } from '@tanstack/react-query';
import { FeedQueryParams } from '../models';
import { useFeedService } from './useFeedService';

/**
 * Hook for fetching feed data
 * @param params Query parameters
 * @returns Query result with feed data
 */
export function useFeed(params: FeedQueryParams = {}) {
  const { feedRepository, getFeedQueryKey } = useFeedService();

  return useQuery({
    queryKey: getFeedQueryKey(params),
    queryFn: () => feedRepository.getFeed(params),
  });
}
