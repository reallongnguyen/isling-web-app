'use client';

import { NavBar as AntNavBar, SafeArea } from 'antd-mobile';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export interface NavBarProps {
  onBack?: () => void;
  title?: string | ReactNode;
  backIcon?: boolean;
  back?: ReactNode;
}

export default function NavBar(props: Readonly<NavBarProps>) {
  const { backIcon = true, onBack, title, back } = props;

  const router = useRouter();

  const goBack = () => router.back();

  return (
    <>
      <SafeArea position='top' />
      <AntNavBar
        className='backdrop-blur-md bg-white/60 fixed top-0 w-[100dvw] z-50'
        back={back}
        onBack={onBack ?? goBack}
        backIcon={backIcon}
      >
        {typeof title === 'string' && <div className='font-[500]'>{title}</div>}
        {title && typeof title !== 'string' && title}
      </AntNavBar>
      <div className='h-[45px]'></div>
    </>
  );
}
