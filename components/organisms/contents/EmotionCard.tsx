'use client';

import { Avatar, ResultPage } from 'antd-mobile';
import { EmotionFeedItem } from '@/modules/feed/models';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  HeartOutline,
  MessageOutline,
  MoreOutline,
  HeartFill,
} from 'antd-mobile-icons';
import { useState, useEffect } from 'react';
import { viewImage } from '@/modules/common/image-proxy';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface EmotionCardProps {
  emotion: EmotionFeedItem;
  onLike?: () => void;
  onUnlike?: () => void;
}

// Extended interface to include optional note property
interface ExtendedEmotionContent {
  type: string;
  note?: string;
}

const emotionEmojiMap: Record<string, string> = {
  joy: '😊',
  sadness: '😢',
  anger: '😡',
  fear: '😨',
  joker: '🤡',
  neutral: '😐',
};

/**
 * Emotion card component for displaying emotion feed items
 */
export default function EmotionCard({
  emotion,
  onLike,
  onUnlike,
}: EmotionCardProps) {
  const { author, content, createdAt, id } = emotion;
  const emotionType = content.type;
  const timeAgo = dayjs(createdAt).fromNow();

  // Add state for likes similar to PostCard
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // Default to 0 since EmotionFeedItem doesn't have stats
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (author?.avatar?.startsWith('gs://')) {
        try {
          const proxyUrl = viewImage(author.avatar);
          const response = await fetch(proxyUrl);
          const data = await response.json();
          if (data && data.url) {
            setAvatarUrl(data.url);
          }
        } catch (error) {
          console.error('Error fetching avatar URL:', error);
          // Fallback to the original avatar if there's an error
          setAvatarUrl(author.avatar);
        }
      } else {
        setAvatarUrl(author.avatar);
      }
    };

    fetchAvatarUrl();
  }, [author?.avatar]);

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

  // Check if the content has a note property
  const extendedContent = content as ExtendedEmotionContent;
  const hasNote = extendedContent.note && extendedContent.note.trim() !== '';

  return (
    <ResultPage.Card className='p-4 mt-3'>
      <div className='flex'>
        <div>
          <div className='rounded-full overflow-hidden'>
            <Avatar src={avatarUrl || ''} style={{ '--size': '40px' }} />
          </div>
        </div>
        <div className='ml-4 w-full'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center'>
              <div className='font-semibold'>{author.name}</div>
              <div className='ml-1'>
                <span className='font-medium'></span> feeling{' '}
                <span className='font-medium'>{emotionType}</span>
              </div>
            </div>
            <div className='flex space-x-2 items-center'>
              <div className='text-gray-500 text-sm'>{timeAgo}</div>
              <div>{emotionEmojiMap[emotionType] || '😐'}</div>
              <div>
                <MoreOutline className='text-xl' />
              </div>
            </div>
          </div>

          {hasNote ? (
            <>
              <div className='mt-0.5'></div>
              <div className='mt-1'>{extendedContent.note}</div>
            </>
          ) : (
            <div>
              <div className='flex items-center'>
                <div className='text-lg mr-2 flex space-x-1'>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={id + index} className='text-lg'>
                      {emotionEmojiMap[emotionType] || '😐'}
                    </div>
                  ))}
                </div>
                {/* <div>
                <span className='font-medium'>{author.name}</span> is feeling{' '}
                <span className='font-medium'>{emotionType}</span>
              </div> */}
              </div>
              <div className='mt-1 text-sm text-gray-500 italic'>
                {getPromptForEmotion(emotionType, author.name)}
              </div>
            </div>
          )}

          {/* Add interaction elements similar to PostCard */}
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
            <div className='text-gray-500 mr-0.5!'>0 replies</div>
            <div className='text-gray-200 mr-0.5!'>・</div>
            <div className='text-gray-500'>{likeCount} likes</div>
          </div>
        </div>
      </div>
    </ResultPage.Card>
  );
}

const getPromptForEmotion = (
  emotionType: string,
  authorName: string
): string => {
  const prompts: Record<string, string[]> = {
    joy: [
      `What made ${authorName} so happy today?`,
      `Share in ${authorName}'s happiness! Ask what brought this joy.`,
      `Curious what's behind this smile? Leave a comment!`,
    ],
    sadness: [
      `Send some support to ${authorName}...`,
      `Let ${authorName} know they're not alone.`,
      `A kind word might help brighten their day.`,
    ],
    anger: [
      `Wonder what triggered this? Check in with ${authorName}.`,
      `Sometimes talking helps cool down. Reach out?`,
      `Ask ${authorName} if there's anything you can do.`,
    ],
    fear: [
      `Everyone needs support when afraid. Be there for ${authorName}.`,
      `A reassuring comment might help ${authorName} feel better.`,
      `Let ${authorName} know they don't have to face this alone.`,
    ],
    joker: [
      `What's the joke? Ask ${authorName} to share!`,
      `There must be a funny story here...`,
      `Don't leave us hanging, ${authorName}! What's so funny?`,
    ],
    neutral: [
      `How's your day going, ${authorName}?`,
      `Check in with ${authorName} - sometimes neutral means thoughtful.`,
      `What's on your mind, ${authorName}?`,
    ],
  };

  // Get prompts for this emotion type, or use neutral as fallback
  const emotionPrompts = prompts[emotionType] || prompts.neutral;

  // Return a random prompt from the available options
  return emotionPrompts[Math.floor(Math.random() * emotionPrompts.length)];
};
