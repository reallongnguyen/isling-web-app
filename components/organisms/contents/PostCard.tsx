import { Avatar } from 'antd-mobile';
import { HeartOutline, MessageOutline, MoreOutline } from 'antd-mobile-icons';

const demoAvatarImages = [
  'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
  'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
  'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
];

export default function PostCard() {
  return (
    <div className='flex'>
      <div>
        <div className='rounded-full overflow-hidden'>
          <Avatar
            src={
              demoAvatarImages[
                Math.round(Math.random() * (demoAvatarImages.length - 1))
              ]
            }
            style={{ '--size': '40px' }}
          />
        </div>
      </div>
      <div className='ml-4'>
        <div className='flex justify-between items-center'>
          <div className='font-semibold'>John Doe</div>
          <div className='flex space-x-2 items-center'>
            <div className='text-gray-500'>5m</div>
            <div>😊</div>
            <div>
              <MoreOutline className='text-xl' />
            </div>
          </div>
        </div>
        <div className='mt-0.5'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
        <div className='flex items-center space-x-2 mt-2'>
          <div>
            <HeartOutline className='text-lg' />
          </div>
          <div>
            <MessageOutline className='text-lg' />
          </div>
          <div className='border-l border-gray-100 ml-2 pr-2 h-3' />
          <div className='text-gray-500 mr-0.5!'>2 replies</div>
          <div className='text-gray-200 mr-0.5!'>・</div>
          <div className='text-gray-500'>24 likes</div>
        </div>
      </div>
    </div>
  );
}
