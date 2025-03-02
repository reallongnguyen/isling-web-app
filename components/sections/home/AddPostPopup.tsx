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
} from 'antd-mobile';
import { PicturesOutline, UserOutline } from 'antd-mobile-icons';
import { useAtom } from 'jotai';
import Image from 'next/image';
import { useState } from 'react';

const emotions = [
  { label: '😊', value: 'joy' },
  { label: '😢', value: 'sadness' },
  { label: '😡', value: 'anger' },
  { label: '😨', value: 'fear' },
  { label: '🤡', value: 'joker' },
];

export interface AddPostPopupProps {
  visible?: boolean;
  close?: () => void;
}

export default function AddPostPopup(props: Readonly<AddPostPopupProps>) {
  const { visible, close } = props;

  const { profile } = useLoggedInUser();
  const [emotion, setEmotion] = useAtom(emotionAtom);
  const [content, setContent] = useState('');

  const handleChangeEmotion = (newEmotion: string) => () => {
    if (emotion === newEmotion) {
      setEmotion('neutral');

      return;
    }

    setEmotion(newEmotion);
  };

  return (
    <Popup
      visible={visible}
      bodyClassName='relative h-[calc(100%-56px)] rounded-t-lg'
      position='bottom'
      onMaskClick={close}
    >
      <NavBar back='Cancel' backIcon={false} onBack={close}>
        <div className='font-semibold'>New Post</div>
      </NavBar>
      <Divider className='mt-0!' />
      <div className='mx-3 flex'>
        <div>
          <div className='relative w-[40px] aspect-square rounded-full overflow-hidden'>
            {profile?.avatar && (
              <Image
                src={viewImage(profile.avatar)}
                sizes='40px'
                fill
                alt='avatar'
              />
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
          </div>
          <div className='mt-0.5'>
            <TextArea
              autoFocus
              autoSize
              placeholder='Your story'
              value={content}
              onChange={setContent}
            />
            <div className='flex space-x-2 items-center'>
              <PicturesOutline className='text-2xl text-gray-400' />
              <div className='border-l border-gray-100 ml-2 pr-2 h-3' />
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
        </div>
      </div>
      <div className='fixed bottom-0 w-full backdrop-blur-md bg-white/40'>
        <div className='mx-3 my-2 flex justify-between'>
          <div className=''></div>
          <Button color='primary'>Post</Button>
        </div>
        <SafeArea position='bottom' />
      </div>
    </Popup>
  );
}
