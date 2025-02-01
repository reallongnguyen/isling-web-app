'use client';

import { deleteAuthToken } from '@/modules/auth/infrastructure/repository/authToken.repo';
import { authAxios } from '@/modules/common/axios/axios-instance';
import { DotLoading } from 'antd-mobile';
import { useEffect } from 'react';

export default function Signout() {
  useEffect(() => {
    authAxios
      .post('/logout?scope=local')
      .catch(console.error)
      .finally(() => {
        deleteAuthToken();
        window.location.href = '/';
      });
  }, []);

  return (
    <div className='h-[100dvh] grid place-items-center'>
      <main>
        <DotLoading color='primary' />
      </main>
    </div>
  );
}
