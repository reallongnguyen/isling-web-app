'use client';

import {
  FeedItem as FeedItemType,
  FeedItemType as FeedItemTypeEnum,
} from '@/modules/feed/models';
import PostCard from './PostCard';
import EmotionCard from './EmotionCard';

interface FeedItemProps {
  item: FeedItemType;
  onLike?: (id: string) => void;
  onUnlike?: (id: string) => void;
}

/**
 * Feed item component that renders different types of feed items
 */
export default function FeedItem({ item, onLike, onUnlike }: FeedItemProps) {
  switch (item.type) {
    case FeedItemTypeEnum.POST:
      return (
        <PostCard
          post={item}
          onLike={() => onLike?.(item.id)}
          onUnlike={() => onUnlike?.(item.id)}
        />
      );
    case FeedItemTypeEnum.EMOTION:
      return <EmotionCard emotion={item} />;
    default:
      return <div>Unknown feed item type</div>;
  }
}
