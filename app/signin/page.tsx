'use client';

import { HomeButton } from '@/components/atoms/buttons/HomeButton';
import { useSignin } from '@/modules/auth/hooks/useSignin';
import { Button, Form, Input } from 'antd-mobile';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [signinForm] = Form.useForm();
  const router = useRouter();

  const { signin } = useSignin();

  const handleSignin = () => {
    signin(signinForm.getFieldsValue()).then(() => {
      goToHome();
    });
  };

  const goToHome = () => router.push('/');

  return (
    <div className='h-[100dvh] overflow-hidden'>
      <main className='mt-24'>
        <div className='mx-6 relative'>
          <div className='text-4xl font-semibold'>Login</div>
          <div className='absolute bottom-full mb-1'>
            <HomeButton onClick={goToHome} />
          </div>
        </div>
        <div className='mx-3 mt-8'>
          <Form
            layout='horizontal'
            mode='card'
            form={signinForm}
            onFinish={handleSignin}
          >
            <Form.Header>
              <div className='font-semibold text-black/88'>Email Address</div>
            </Form.Header>
            <Form.Item
              name='email'
              required
              rules={[
                {
                  type: 'email',
                  required: true,
                  validateTrigger: 'noTrigger',
                },
              ]}
            >
              <Input placeholder='hello@example.com' />
            </Form.Item>
            <Form.Header>
              <div className='font-semibold text-black/88'>Password</div>
            </Form.Header>
            <Form.Item
              name='password'
              required
              rules={[
                {
                  type: 'string',
                  required: true,
                  validateTrigger: 'noTrigger',
                },
              ]}
            >
              <Input placeholder='••••••••••••••••' type='password' />
            </Form.Item>
            <Form.Header />
          </Form>
        </div>
        <div className='mx-6 mt-10'>
          <div>
            By continuing, you agree to our{' '}
            <Link href='/terms-of-service' className='text-white'>
              Terms of Service
            </Link>
            .
          </div>
          <div className='mt-4'></div>
          <Button
            className='w-full'
            color='primary'
            shape='rounded'
            size='large'
            onClick={() => signinForm.submit()}
          >
            Login
          </Button>
        </div>
        <div className='mt-16 flex justify-center'>
          <div className='text-black/40'>Don&#39;t have an account?</div>
          <Link className='ml-1' href='/signup'>
            Sign up
          </Link>
        </div>
      </main>
    </div>
  );
}
