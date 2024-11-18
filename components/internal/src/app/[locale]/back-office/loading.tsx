import { Spin } from 'antd';

export default function Loading() {
  return <div className='h-screen w-full flex items-center justify-center bg-white'>
   <Spin size='large' />
  </div>
}
