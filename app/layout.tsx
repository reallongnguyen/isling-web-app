import type { Metadata } from 'next';
import './globals.css';
import Provider from './provider';

export const metadata: Metadata = {
  title: 'Isling',
  description: 'Life Good',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider>
      <html
        lang='en'
        data-prefers-color='light'
        data-prefers-color-scheme='light'
      >
        <body className='antialiased'>{children}</body>
      </html>
    </Provider>
  );
}
