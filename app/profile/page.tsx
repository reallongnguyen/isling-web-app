'use client';

import TabBar from '@/components/organisms/TabBar';
import GuestProfile from '@/components/sections/profile/GuestProfile';
import UserProfile from '@/components/sections/profile/UserProfile';
import useLoggedInUser from '@/modules/user/hooks/useLoggedInUser';
import { Footer } from 'antd-mobile';

export default function Home() {
  const { profile } = useLoggedInUser();

  return (
    <div className='h-[100dvh]'>
      {profile && <UserProfile profile={profile} />}
      {!profile && <GuestProfile />}
      <Footer
        className='bg-transparent! pt-6'
        content={`© ${new Date().getFullYear()} Isling`}
      ></Footer>
      <TabBar />
    </div>
  );
}
