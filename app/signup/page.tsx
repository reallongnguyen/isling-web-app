'use client';

import { HomeButton } from '@/components/atoms/buttons/HomeButton';
import { useInitialAccount } from '@/modules/auth/hooks/useInitialAccount';
import { useSignup } from '@/modules/auth/hooks/useSignup';
import { InitialAccountStep } from '@/modules/auth/models/initial-account-step.enum';
import { initialAccountStepAtom } from '@/modules/auth/store/initial-account-step';
import { Button, Form, Input, Swiper, SwiperRef } from 'antd-mobile';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function Signup() {
  const [signupForm] = Form.useForm();
  const [createUserForm] = Form.useForm();
  const [initialAccountStep, setInitialAccountStep] = useAtom(
    initialAccountStepAtom
  );
  const swiperRef = useRef<SwiperRef>(null);
  const router = useRouter();

  const { signup } = useSignup();
  const { createUser } = useInitialAccount();

  const handleSignup = () => {
    signup(signupForm.getFieldsValue()).then(() => {
      setInitialAccountStep(InitialAccountStep.CREATE_USER);
    });
  };

  const handleCreateUser = () => {
    createUser(createUserForm.getFieldsValue()).then(() => {
      setInitialAccountStep(InitialAccountStep.SUCCESS_RESULT);
    });
  };

  const goToHome = () => router.push('/');

  useEffect(() => {
    swiperRef?.current?.swipeTo(initialAccountStep);
  }, [initialAccountStep]);

  return (
    <div className='h-[100dvh] overflow-hidden'>
      <Swiper ref={swiperRef} indicator={() => null}>
        <Swiper.Item key={InitialAccountStep.AUTH_SIGNUP}>
          <main className='mt-24'>
            <div className='mx-6 relative'>
              <div className='text-4xl font-semibold'>Create an account</div>
              <div className='absolute bottom-full mb-1'>
                <HomeButton onClick={goToHome} />
              </div>
            </div>
            <div className='mx-3 mt-8'>
              <Form
                layout='horizontal'
                mode='card'
                form={signupForm}
                onFinish={handleSignup}
              >
                <Form.Header>
                  <div className='font-semibold text-black/88'>
                    Email Address
                  </div>
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
                      min: 8,
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
                onClick={() => signupForm.submit()}
              >
                Sign up
              </Button>
            </div>
            <div className='mt-16 flex justify-center'>
              <div className='text-black/40'>Already have an account?</div>
              <Link className='ml-1' href='/signin'>
                Sign in
              </Link>
            </div>
          </main>
        </Swiper.Item>
        <Swiper.Item key={InitialAccountStep.CREATE_USER}>
          <main className='mt-24'>
            <div className='mx-6 relative'>
              <div className='absolute bottom-full text-xl text-black/60'>
                Just one more step
              </div>
              <div className='text-4xl font-semibold'>Create your profile</div>
            </div>
            <div className='mx-3 mt-8'>
              <Form
                layout='horizontal'
                mode='card'
                form={createUserForm}
                onFinish={handleCreateUser}
              >
                <Form.Header>
                  <div className='font-semibold text-black/88'>Name</div>
                </Form.Header>
                <Form.Item
                  name='name'
                  required
                  rules={[
                    {
                      type: 'string',
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder='John Doe' />
                </Form.Item>
              </Form>
            </div>
            <div className='mx-6 mt-10'>
              <Button
                className='w-full'
                color='primary'
                shape='rounded'
                size='large'
                onClick={() => createUserForm.submit()}
              >
                Save
              </Button>
            </div>
          </main>
        </Swiper.Item>
        <Swiper.Item key={InitialAccountStep.SUCCESS_RESULT}>
          <main className='mt-24'>
            <div className='mx-16 aspect-square relative'>
              <Image src='/images/status/success.png' fill alt='success' />
            </div>
            <div className='mx-6 mt-8 text-center'>
              <div className='text-2xl font-semibold text-center'>
                Congratulations!
              </div>
            </div>
            <div className='mx-6 mt-8 text-lg text-center text-black/60'>
              Your account have been created successfully.
            </div>
            <div className='mx-6 mt-2 text-lg text-center text-black/60'>
              Thank you for signing up with us!
            </div>
            <div className='mx-6 mt-10'>
              <Button
                className='w-full'
                color='primary'
                shape='rounded'
                size='large'
                onClick={goToHome}
              >
                Start
              </Button>
            </div>
          </main>
        </Swiper.Item>
      </Swiper>
    </div>
  );
}
