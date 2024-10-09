import React, { memo } from 'react'
import { useSelector } from 'react-redux';

const Empty = () => {

  const { user} = useSelector((state) => state.authReducer);

  return (
    <div className=' w-full h-full bg-[#EFF3F6] flex justify-center items-center  overflow-auto scroll'>
      <div className=' text-[2.1rem] flex items-center justify-center flex-col font-semibold text-[#202020] '>
      <p className=' mt-6'>Hey {user.name}</p>
      <div className=' max-h-[500px] overflow-hidden'>
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/friends-talking-to-each-other-illustration-download-in-svg-png-gif-file-formats--people-chatting-talk-public-conversation-illustrations-4469013.png" alt="" />
      </div>
      <p className=' max-lg:text-lg text-2xl mb-1'>Start chatting with your friends!</p>
      </div>
    </div>
  )
}

export default memo(Empty)