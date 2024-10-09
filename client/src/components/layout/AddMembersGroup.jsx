import React, { memo } from 'react'
import { useSelector } from 'react-redux';
import { sendFriendRequest } from '../../tanstack/chats_logic';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import { Grow, IconButton, Tooltip } from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const AddMembersGroup = ({ usersToAdd,userNotInGroup, setUsersToAdd }) => {


  const handleAddClicked = (user) => {
    if (usersToAdd.includes(user)) {
      setUsersToAdd(usersToAdd.filter(u => u !== user));
    } else {
      setUsersToAdd([...usersToAdd, user]);
    }
  }


  return (
    <div className=' w-full  border-[#e0e0e0]   overflow-auto h-[140px]  scroll mt-2'>{
    userNotInGroup.length ?
    userNotInGroup?.map((user) => (
        <div key={user._id} className=' flex items-center py-1 gap-x-3  hover:bg-[#f5f5f5] border-[#e0e0e0] px-4 justify-between cursor-pointer'>
          <div className=' flex items-center gap-x-3'>
            <div className=' w-6 h-[1.6rem]'>
              <img className='w-full h-full object-cover rounded-3xl' src={user.avatar.url} alt="Profile pic" />
            </div>
            <span>{user.name}</span>
          </div>
          <div>
            {
              usersToAdd.includes(user)
                ?
                <Tooltip
                  title={'Add user'}
                  placement="left"
                  arrow
                  aria-label={'Add user'}
                  TransitionComponent={Grow}
                >
                  <IconButton sx={{ padding: '0px', color: 'red' }} onClick={() => handleAddClicked(user)}>
                    <RemoveOutlinedIcon />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip
                  title={'Remove user'}
                  placement="left"
                  arrow
                  aria-label={'Remove user'}
                  TransitionComponent={Grow}
                >
                  <IconButton sx={{ padding: '0px', color: '#00c300' }} onClick={() => handleAddClicked(user)}>
                    <AddOutlinedIcon />
                  </IconButton>
                </Tooltip>
            }

          </div>
        </div>
      ))
      :
      <div className=' h-full w-full flex justify-center items-center'>
        User Not Found
      </div>
    }</div>
  )
}

export default memo(AddMembersGroup)