import { Button, Divider, List } from 'antd-mobile';
import { MailOutline } from 'antd-mobile-icons';
import Link from 'next/link';

export default function GuestProfile() {
  return (
    <main>
      <List mode='card' className='px-1 pt-4'>
        <List.Item>
          <div className='flex justify-center items-center text-lg font-semibold'>
            Log in to Isling
          </div>
          <div className='mt-4'>
            <div>
              <Link href='/signin'>
                <Button className='w-full' color='primary'>
                  <div className='relative flex items-center justify-center'>
                    <div>Use email</div>
                    <div className='absolute left-0'>
                      <MailOutline className='text-2xl' />
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
          <Divider />
          <div className='flex justify-center'>
            <div>Don’t have an account?</div>
            <Link className='ml-1' href='/signup'>
              Sign up
            </Link>
          </div>
        </List.Item>
      </List>
    </main>
  );
}
