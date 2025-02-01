'use client';

import { configAxiosInterceptor } from '@/modules/auth/infrastructure/axios.config';
import { apiAxios, authAxios } from '@/modules/common/axios/axios-instance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US';

const queryClient = new QueryClient();
const goToSignout = () => (window.location.href = '/signout');

configAxiosInterceptor(authAxios, goToSignout);
configAxiosInterceptor(apiAxios, goToSignout);

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = enUS;

  return (
    <ConfigProvider locale={locale}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
}
