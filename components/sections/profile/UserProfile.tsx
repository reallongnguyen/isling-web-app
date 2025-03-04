import { Profile } from '@/modules/user/models/profile.model';
import { List } from 'antd-mobile';
import Link from 'next/link';
import Image from 'next/image';
import { UserOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { viewImage } from '@/modules/common/image-proxy';
import { useState, useEffect } from 'react';

export interface UserProfileProps {
  profile: Profile;
}

export default function UserProfile(props: Readonly<UserProfileProps>) {
  const { profile } = props;
  const joinedAt = dayjs(profile.createdAt).format('MMMM YYYY');
  const router = useRouter();
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
  }, [profile.avatar]);

  const goToEditProfile = () => {
    router.push('/profile/me/edit');
  };

  return (
    <main>
      <List mode='card' className='px-1 pt-6 mt-0!'>
        <List.Item onClick={goToEditProfile} extra='Edit'>
          <div className='flex items-center'>
            <div className='flex justify-center'>
              <div className='relative w-[80px] aspect-square rounded-full overflow-hidden'>
                {profile.avatar && (
                  <Image src={avatarUrl || ''} fill alt='avatar' />
                )}
                {!profile.avatar && (
                  <div className='w-[80px] aspect-square flex justify-center items-center bg-gray-200'>
                    <UserOutline className='text-5xl text-white' />
                  </div>
                )}
              </div>
            </div>
            <div className='ml-4'>
              <div className='text-2xl font-semibold'>{profile.firstName}</div>
              <div className='mt-1 text-gray-500'>Joined {joinedAt}</div>
            </div>
          </div>
        </List.Item>
      </List>
      <List mode='card' className='px-1 pt-4'>
        <Link href='/signout'>
          <List.Item className='text-center text-red-400'>Logout</List.Item>
        </Link>
      </List>
    </main>
  );
}
