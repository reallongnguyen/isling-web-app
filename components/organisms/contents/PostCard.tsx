'use client';

import { Avatar } from 'antd-mobile';
import {
  HeartFill,
  HeartOutline,
  MessageOutline,
  MoreOutline,
} from 'antd-mobile-icons';
import { PostFeedItem } from '@/modules/feed/models';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface PostCardProps {
  post: PostFeedItem;
  onLike?: () => void;
  onUnlike?: () => void;
}

const emotionEmojiMap: Record<string, string> = {
  joy: '😊',
  sadness: '😢',
  anger: '😡',
  fear: '😨',
  joker: '🃏',
  neutral: '😐',
};

export default function PostCard({ post, onLike, onUnlike }: PostCardProps) {
  const { author, content, stats, createdAt } = post;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(stats.likes);
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      onUnlike?.();
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      onLike?.();
    }
  };

  // Check if the post has an emotion type (added as a custom property)
  const emotionType = (content as { emotionType?: string }).emotionType;

  return (
    <div className='flex'>
      <div>
        <div className='rounded-full overflow-hidden'>
          <Avatar src={author.avatar} style={{ '--size': '40px' }} />
        </div>
      </div>
      <div className='ml-4 w-full'>
        <div className='flex justify-between items-center'>
          <div className='font-semibold'>{author.name}</div>
          <div className='flex space-x-2 items-center'>
            <div className='text-gray-500 text-sm'>{timeAgo}</div>
            {emotionType && <div>{emotionEmojiMap[emotionType] || '😐'}</div>}
            <div>
              <MoreOutline className='text-xl' />
            </div>
          </div>
        </div>
        <div className='mt-0.5'>{content.text}</div>
        {content.media && content.media.length > 0 && (
          <div className='mt-2 rounded-lg overflow-hidden'>
            <img
              src={content.media[0]}
              alt='Post media'
              className='w-full h-auto'
            />
          </div>
        )}
        <div className='flex items-center space-x-2 mt-2'>
          <button onClick={handleLikeToggle} className='flex items-center'>
            {isLiked ? (
              <HeartFill className='text-lg text-red-500' />
            ) : (
              <HeartOutline className='text-lg' />
            )}
          </button>
          <div>
            <MessageOutline className='text-lg' />
          </div>
          <div className='border-l border-gray-100 ml-2 pr-2 h-3' />
          <div className='text-gray-500 mr-0.5!'>{stats.replies} replies</div>
          <div className='text-gray-200 mr-0.5!'>・</div>
          <div className='text-gray-500'>{likeCount} likes</div>
        </div>
      </div>
    </div>
  );
}
