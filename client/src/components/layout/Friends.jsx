import React from 'react'
import { useSelector } from 'react-redux';
import { sendFriendRequest } from '../../tanstack/chats_logic';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import { Grow, IconButton, Tooltip } from '@mui/material';

const Friends = () => {
  const { usersSearch } = useSelector((state) => state.authReducer);

  // console.log(usersSearch , 'usersSearch');

  const { mutate } = sendFriendRequest();

  const handleSendFriendRequest = (user) => {
    console.log('handle send frined request ');
    
    mutate(user._id)
  }

  return (
    <div className=' w-full border-t border-[#e0e0e0]  mt-4'>{
      usersSearch.map((user) => (
        <div key={user._id} className=' flex items-center py-2 gap-x-3  border-b hover:bg-[#f5f5f5] border-[#e0e0e0] px-2 justify-between cursor-pointer'>
          <div className=' flex items-center gap-x-3'>
            <div className=' w-6 h-6'>
              <img className='w-full h-full object-cover rounded-3xl' src={'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'} alt="Profile pic" />
            </div>
            <span>{user.name}</span>
          </div>
          <div className=' mr-8'>

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
    }</div>
  )
}

export default Friends