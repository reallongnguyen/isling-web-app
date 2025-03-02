'use client';

import TabBar from '@/components/organisms/TabBar';
import React, { useState } from 'react';
import { InfiniteScroll, PullToRefresh, ResultPage } from 'antd-mobile';
import EmotionLand from '@/components/organisms/EmotionLand';
import useLoggedInUser from '@/modules/user/hooks/useLoggedInUser';
import { useAtomValue } from 'jotai';
import { emotionAtom } from '@/modules/ping/store/emotion';
import PostCard from '@/components/organisms/contents/PostCard';
import { FireFill } from 'antd-mobile-icons';
import AddPostPopup from '@/components/sections/home/AddPostPopup';

const emotionColorMap: Record<string, string> = {
  joy: '#FACC31',
  sadness: '#3295C3',
  anger: '#E2544B',
  fear: '#A471F6',
  joker: 'var(--color-amber-500)',
  neutral: 'var(--color-sky-500)',
};

export default function Home() {
  const { profile } = useLoggedInUser();
  const emotion = useAtomValue(emotionAtom);
  const [showAddPost, setShowAddPost] = useState(false);

  const Card = ResultPage.Card;

  return (
    <div className='h-[100dvh]'>
      <main className='relative'>
        <header className='flex items-center absolute h-12 mx-3 z-50'>
          <div className='text-white flex items-center'>
            <FireFill className='text-2xl' />
            <div className='font-semibold'>88</div>
          </div>
          <div className='ml-2 flex space-x-0.5'>
            {['joy', 'joy', 'sadness', 'anger', 'joy', 'joker', 'joy'].map(
              (emo, index) => (
                <div
                  key={index}
                  className='border border-white/40 w-2 h-3.5 rounded-xs brightness-110'
                  style={{ backgroundColor: emotionColorMap[emo] }}
                ></div>
              )
            )}
          </div>
        </header>
        <ResultPage
          style={{
            '--background-color': emotionColorMap[emotion],
          }}
          title={<div className='h-4'></div>}
          icon={<div className='h-4'></div>}
        >
          <PullToRefresh>
            {profile && (
              <Card className='p-4' style={{ height: 64 }}>
                <EmotionLand
                  profile={profile}
                  onClick={() => setShowAddPost(true)}
                />
              </Card>
            )}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
              <Card key={index} className='p-4 mt-3'>
                <PostCard />
              </Card>
            ))}
          </PullToRefresh>
          <InfiniteScroll
            loadMore={async (isRetry: boolean) => {
              console.log(isRetry);
            }}
            hasMore={false}
          />
        </ResultPage>
      </main>
      <AddPostPopup visible={showAddPost} close={() => setShowAddPost(false)} />
      <TabBar />
    </div>
  );
}
