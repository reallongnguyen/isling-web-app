'use client';

import { NavBar as AntNavBar, SafeArea } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { HomeButton } from '../atoms/buttons/HomeButton';

export interface NavBarProps {
  onBack?: () => void;
  title?: string | ReactNode;
  backIcon?: boolean;
}

export default function NavBar(props: Readonly<NavBarProps>) {
  const { backIcon = true, onBack, title } = props;

  const router = useRouter();

  const goToHome = () => router.push('/');

  return (
    <>
      <SafeArea position='top' />
      <AntNavBar
        className='backdrop-blur-md bg-white/60 fixed top-0 w-[100dvw] z-50'
        back={backIcon ? <HomeButton /> : undefined}
        onBack={onBack ?? goToHome}
        backIcon={false}
      >
        {typeof title === 'string' && <div className='font-[500]'>{title}</div>}
        {title && typeof title !== 'string' && title}
      </AntNavBar>
      <div className='h-[45px]'></div>
    </>
  );
}
