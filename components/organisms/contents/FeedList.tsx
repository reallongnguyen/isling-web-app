'use client';

import {
  InfiniteScroll,
  PullToRefresh,
  DotLoading,
  ErrorBlock,
} from 'antd-mobile';
import { useInfiniteFeed, useFeedService } from '@/modules/feed/hooks';
import { FeedQueryParams } from '@/modules/feed/models';
import FeedItem from './FeedItem';
import { useCallback } from 'react';

interface FeedListProps {
  params?: FeedQueryParams;
}

/**
 * Feed list component that displays a list of feed items with infinite scrolling
 */
export default function FeedList({ params = {} }: FeedListProps) {
  const { likeFeedItem, unlikeFeedItem } = useFeedService();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteFeed(params);

  const handleRefresh = async () => {
    await refetch();
  };

  const loadMore = useCallback(async () => {
    if (hasNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  const handleLike = useCallback(
    async (id: string) => {
      try {
        await likeFeedItem(id);
      } catch (error) {
        console.error('Error liking feed item:', error);
      }
    },
    [likeFeedItem]
  );

  const handleUnlike = useCallback(
    async (id: string) => {
      try {
        await unlikeFeedItem(id);
      } catch (error) {
        console.error('Error unliking feed item:', error);
      }
    },
    [unlikeFeedItem]
  );

  if (isLoading && !data) {
    return (
      <div className='flex justify-center items-center py-8'>
        <DotLoading color='primary' />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <ErrorBlock
          status='default'
          title='Failed to load feed'
          description={error?.message || 'Please try again later'}
        />
        <div className='flex justify-center mt-4'>
          <button
            onClick={() => refetch()}
            className='px-4 py-2 bg-blue-500 text-white rounded-md'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const allItems = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className='space-y-4'>
          {allItems.map((item) => (
            <FeedItem
              key={item.id}
              item={item}
              onLike={handleLike}
              onUnlike={handleUnlike}
            />
          ))}
          {allItems.length === 0 && !isLoading && (
            <div className='text-center py-8 text-gray-500'>
              No items to display
            </div>
          )}
        </div>
      </PullToRefresh>
      <InfiniteScroll loadMore={loadMore} hasMore={!!hasNextPage} />
    </div>
  );
}
