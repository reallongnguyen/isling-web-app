'use client';

import NavBar from '@/components/organisms/NavBar';
import { viewImage } from '@/modules/common/image-proxy';
import useLoggedInUser from '@/modules/user/hooks/useLoggedInUser';
import { useProfile } from '@/modules/user/hooks/useProfile';
import {
  Button,
  Form,
  ImageUploader,
  ImageUploadItem,
  Input,
} from 'antd-mobile';
import { PictureOutline } from 'antd-mobile-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function EditProfile() {
  const { profile } = useLoggedInUser();

  const [createUserForm] = Form.useForm();
  const avatar = Form.useWatch('avatar', createUserForm);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const { getUploadAvatar, uploadFile, updateProfile } = useProfile();

  const handleUploadAvatar = async (file: File): Promise<ImageUploadItem> => {
    const { uploadUrl, objectUrl } = await getUploadAvatar({
      mimeType: file.type,
      fileSize: file.size,
    });

    await uploadFile({
      fileSize: file.size,
      mimeType: file.type,
      uploadUrl,
      file,
    });

    createUserForm.setFieldValue('avatar', objectUrl);

    return {
      url: objectUrl,
    };
  };

  const handleUpdateProfile = async () => {
    const input = createUserForm.getFieldsValue();

    if (input.avatar === '') {
      input.avatar = null;
    }

    await updateProfile(input);
  };

  useEffect(() => {
    if (!profile) {
      return;
    }

    createUserForm.setFieldsValue({
      name: profile.firstName,
      avatar: profile.avatar ?? '',
    });
  }, [profile, createUserForm]);

  return (
    <div className='h-[100dvh]'>
      <NavBar title='Edit Profile' />
      <main>
        <div className='mx-3 mt-4'>
          <Form
            layout='horizontal'
            mode='card'
            form={createUserForm}
            onFinish={handleUpdateProfile}
          >
            <Form.Header>
              <div className='font-semibold text-black/88'>Profile image</div>
              <div className='mt-4 flex justify-center -mr-3'>
                <div className='w-[180px] aspect-square rounded-full overflow-hidden'>
                  <ImageUploader
                    value={fileList}
                    onChange={setFileList}
                    upload={handleUploadAvatar}
                    maxCount={1}
                    style={{
                      '--cell-size': '188px',
                    }}
                    accept='image/jpeg,image/jpg,image/png'
                    renderItem={(_, { url }) => (
                      <div
                        key={url}
                        className='relative w-[180px] aspect-square'
                      >
                        <Image
                          sizes='180px'
                          src={viewImage(url)}
                          fill
                          alt='avatar'
                        />
                      </div>
                    )}
                  >
                    <div className='relative w-[180px] aspect-square flex justify-center bg-white items-center'>
                      {!avatar && <PictureOutline style={{ fontSize: 48 }} />}
                      {avatar && (
                        <>
                          <Image
                            sizes='180px'
                            src={viewImage(avatar)}
                            fill
                            alt='avatar'
                          />
                          <div className='absolute left-1/2 bottom-4 transform -translate-x-1/2 bg-white/90 border border-white/95 rounded-full px-2 py-0.5'>
                            Change
                          </div>
                        </>
                      )}
                    </div>
                  </ImageUploader>
                </div>
              </div>
            </Form.Header>
            <Form.Item hidden name='avatar' rules={[{ type: 'string' }]}>
              <Input />
            </Form.Item>
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
    </div>
  );
}
