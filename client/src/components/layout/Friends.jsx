import React, { memo } from 'react'
import { useSelector } from 'react-redux';
import { sendFriendRequest } from '../../tanstack/chats_logic';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import { Grow, IconButton, Tooltip } from '@mui/material';

const Friends = () => {
  const { usersSearch } = useSelector((state) => state.authReducer);
  const { mutate } = sendFriendRequest();

  const handleSendFriendRequest = (user) => {
    mutate(user?._id)
  }

  return (
    <div className={` w-full ${usersSearch.length>0 && 'border-t'} border-[#e0e0e0]  mt-4`}>{
      usersSearch.length>0
        ?
      usersSearch.map((user) => (
        <div key={user?._id} className=' flex items-center py-2 gap-x-3  border-b hover:bg-[#f5f5f5] border-[#e0e0e0] px-4 justify-between cursor-pointer'>
          <div className=' flex items-center gap-x-3'>
            <div className=' w-6 h-[1.6rem]'>
              <img className='w-full h-full object-cover rounded-3xl' src={user?.avatar} alt="Profile pic" />
            </div>
            <span>{user?.name}</span>
          </div>
          <div>

            <Tooltip
              title={'Send Request'}
              placement="left"
              arrow
              aria-label={'Send Request'}
              TransitionComponent={Grow}
            >
              <IconButton sx={{padding : '0px'}} onClick={() => handleSendFriendRequest(user)}>
              <PersonAddAltIcon/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ))
      :
      <div className=' flex justify-center items-center h-[300px] '>All users are your friends</div>
    }</div>
  )
}

export default memo(Friends)