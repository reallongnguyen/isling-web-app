import { viewImage } from '@/modules/common/image-proxy';
import { emotionAtom } from '@/modules/ping/store/emotion';
import useLoggedInUser from '@/modules/user/hooks/useLoggedInUser';
import {
  Button,
  Divider,
  NavBar,
  Popup,
  SafeArea,
  TextArea,
  Toast,
} from 'antd-mobile';
import { UserOutline } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useEmotionService } from '@/modules/emotion/hooks/useEmotionService';
import { useQueryClient } from '@tanstack/react-query';

const emotions = [
  { label: '😊', value: 'joy' },
  { label: '😢', value: 'sadness' },
  { label: '😡', value: 'anger' },
  { label: '😨', value: 'fear' },
  { label: '🤡', value: 'joker' },
];

const MAX_NOTE_LENGTH = 256;

export interface AddPostPopupProps {
  visible?: boolean;
  close?: () => void;
}

export default function AddPostPopup(props: Readonly<AddPostPopupProps>) {
  const { visible, close } = props;

  const { profile } = useLoggedInUser();
  const [emotion, setEmotion] = useAtom(emotionAtom);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createEmotion, isCreating } = useEmotionService();
  const queryClient = useQueryClient();
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  // Fetch and process the avatar URL
  useEffect(() => {
    const fetchAvatarUrl = async () => {
      if (profile?.avatar?.startsWith('gs://')) {
        try {
          const proxyUrl = viewImage(profile.avatar);
          const response = await fetch(proxyUrl);
          const data = await response.json();
          if (data && data.url) {
            setAvatarUrl(data.url);
          }
        } catch (error) {
          console.error('Error fetching avatar URL:', error);
          setAvatarUrl(profile.avatar || '');
        }
      } else if (profile?.avatar) {
        setAvatarUrl(profile.avatar);
      } else {
        setAvatarUrl('');
      }
    };

    fetchAvatarUrl();
  }, [profile?.avatar]);

  // Reset form when popup is opened/closed
  useEffect(() => {
    if (!visible) {
      setNote('');
      // Don't reset emotion as it's shared state
    }
  }, [visible]);

  const handleChangeEmotion = (newEmotion: string) => () => {
    if (emotion === newEmotion) {
      setEmotion('neutral');
      return;
    }
    setEmotion(newEmotion);
  };

  const handleNoteChange = (value: string) => {
    // Limit note to MAX_NOTE_LENGTH characters
    if (value.length <= MAX_NOTE_LENGTH) {
      setNote(value);
    }
  };

  const handlePost = async () => {
    if (!emotion || emotion === 'neutral') {
      Toast.show({
        content: 'Please select an emotion',
        position: 'bottom',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the emotion with optional note
      await createEmotion({
        type: emotion as 'joy' | 'sadness' | 'anger' | 'fear' | 'joker',
        note: note.trim() || null,
      });

      // Invalidate feeds query to refresh the feed
      queryClient.invalidateQueries({ queryKey: ['feeds'] });

      // Close the popup
      if (close) {
        close();
      }

      // Show success message
      Toast.show({
        content: 'Emotion posted successfully',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Error posting emotion:', error);
      Toast.show({
        content: 'Failed to post emotion. Please try again.',
        position: 'bottom',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_NOTE_LENGTH - note.length;

  return (
    <Popup
      visible={visible}
      bodyClassName='relative h-[calc(100%-56px)] rounded-t-lg'
      position='bottom'
      onMaskClick={close}
    >
      <NavBar back='Cancel' backIcon={false} onBack={close}>
        <div className='font-semibold'>New Emotion</div>
      </NavBar>
      <Divider className='mt-0!' />
      <div className='mx-3 flex'>
        <div>
          <div className='relative w-[40px] aspect-square rounded-full overflow-hidden'>
            {profile?.avatar && (
              <Image src={avatarUrl} sizes='40px' fill alt='avatar' />
            )}
            {!profile?.avatar && (
              <div className='w-[40px] aspect-square flex justify-center items-center bg-gray-200'>
                <UserOutline className='text-5xl text-white' />
              </div>
            )}
          </div>
        </div>
        <div className='ml-4 grow'>
          <div className='flex justify-between items-center'>
            <div className='font-semibold text-lg'>{profile?.firstName}</div>
            <div className='text-sm text-gray-500'>
              {emotion !== 'neutral' && (
                <span>
                  Feeling{' '}
                  <span className='font-medium'>
                    {emotion} {emotions.find((e) => e.value === emotion)?.label}
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className='mt-0.5'>
            <TextArea
              autoFocus
              autoSize
              placeholder='How are you feeling? Add a note (optional)'
              value={note}
              onChange={handleNoteChange}
              maxLength={MAX_NOTE_LENGTH}
            />
            <div className='flex justify-between items-center'>
              <div className='flex space-x-2 items-center'>
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
              <div className='text-xs text-gray-400'>
                {remainingChars} characters left
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed bottom-0 w-full backdrop-blur-md bg-white/40'>
        <div className='mx-3 my-2 flex justify-between'>
          <div className=''></div>
          <Button
            color='primary'
            loading={isSubmitting || isCreating}
            disabled={isSubmitting || isCreating || emotion === 'neutral'}
            onClick={handlePost}
          >
            Post
          </Button>
        </div>
        <SafeArea position='bottom' />
      </div>
    </Popup>
  );
}
