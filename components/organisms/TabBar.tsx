'use client';

import { TabBar as AntTabBar } from 'antd-mobile';
import {
  AppOutline,
  AppstoreOutline,
  BellOutline,
  UserOutline,
} from 'antd-mobile-icons';
import { usePathname, useRouter } from 'next/navigation';

export default function TabBar() {
  const path = usePathname();
  const router = useRouter();

  const handleChangeKey = (key: string) => {
    router.push(key);
  };

  const tabs = [
    {
      key: '/',
      title: 'For You',
      icon: <AppOutline />,
    },
    {
      key: '/app',
      title: 'App',
      icon: <AppstoreOutline />,
    },
    {
      key: '/notification',
      title: 'Notifications',
      icon: <BellOutline />,
    },
    {
      key: '/profile',
      title: 'Profile',
      icon: <UserOutline />,
    },
  ];

  return (
    <AntTabBar
      safeArea
      className='backdrop-blur-md bg-white/60 fixed bottom-0 w-[100dvw] z-50'
      activeKey={path}
      onChange={handleChangeKey}
    >
      {tabs.map((item) => (
        <AntTabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </AntTabBar>
  );
}
