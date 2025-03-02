import { viewImage } from '@/modules/common/image-proxy';
import { Profile } from '@/modules/user/models/profile.model';
import { Button } from 'antd-mobile';
import { UserOutline } from 'antd-mobile-icons';
import Image from 'next/image';
import { MouseEvent } from 'react';
import { useEmotionSelection } from '@/modules/emotion/hooks';

const emotions = [
  { label: '😊', value: 'joy' },
  { label: '😢', value: 'sadness' },
  { label: '😡', value: 'anger' },
  { label: '😨', value: 'fear' },
  { label: '🤡', value: 'joker' },
];

export interface EmotionLandProps {
  profile: Profile;
  onClick?: () => void;
}

export default function EmotionLand(props: Readonly<EmotionLandProps>) {
  const { profile, onClick } = props;
  const { emotion, handleEmotionChange, isLoading } = useEmotionSelection();

  const handleClick =
    (newEmotion: string) => (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      handleEmotionChange(newEmotion);
    };

  return (
    <div className='flex items-center h-full' onClick={onClick}>
      <div className='flex justify-center'>
        <div className='relative w-[40px] aspect-square rounded-full overflow-hidden'>
          {profile.avatar && (
            <Image
              src={viewImage(profile.avatar)}
              sizes='40px'
              fill
              alt='avatar'
            />
          )}
          {!profile.avatar && (
            <div className='w-[40px] aspect-square flex justify-center items-center bg-gray-200'>
              <UserOutline className='text-5xl text-white' />
            </div>
          )}
        </div>
      </div>
      <div className='ml-4'>
        <div>How are you feeling today?</div>
        <div className='flex space-x-1 mt-0.5'>
          {emotions.map((option) => (
            <div key={option.value}>
              <Button
                loading={isLoading(option.value)}
                className={`p-0! m-0! w-6! h-6! ${
                  emotion === option.value
                    ? 'bg-blue-400/40! border-blue-400/60!'
                    : ''
                }`}
                onClick={handleClick(option.value)}
              >
                {!isLoading(option.value) && option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
