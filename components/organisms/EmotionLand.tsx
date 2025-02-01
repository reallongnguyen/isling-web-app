import { viewImage } from '@/modules/common/image-proxy';
import { emotionAtom } from '@/modules/ping/store/emotion';
import { Profile } from '@/modules/user/models/profile.model';
import { Button } from 'antd-mobile';
import { UserOutline } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import Image from 'next/image';

const emotions = [
  { label: '😊', value: 'joy' },
  { label: '😢', value: 'sadness' },
  { label: '😡', value: 'anger' },
  { label: '😨', value: 'fear' },
  { label: '🤡', value: 'joker' },
];

export interface EmotionLandProps {
  profile: Profile;
}

export default function EmotionLand(props: Readonly<EmotionLandProps>) {
  const { profile } = props;
  const [emotion, setEmotion] = useAtom(emotionAtom);

  const handleChangeEmotion = (newEmotion: string) => () => {
    if (emotion === newEmotion) {
      setEmotion('neutral');

      return;
    }

    setEmotion(newEmotion);
  };

  return (
    <div className='flex items-center h-full'>
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
                className={`p-0! m-0! w-6! h-6! ${
                  emotion === option.value
                    ? 'bg-blue-400/40! border-blue-400/60!'
                    : ''
                }`}
                onClick={handleChangeEmotion(option.value)}
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
