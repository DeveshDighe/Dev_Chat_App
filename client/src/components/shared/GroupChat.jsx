import { Dialog } from '@mui/material';
import React, { memo, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'


const GroupChat = ({ avatar = [], name, _id, Lastmessage, groupChat = false, isOnline, sameSender, newMessageAlert, index, handleDeleteChatOpen, newMessages}) => {

  const [dbClick, setDpClick] = useState(false);
  const navigate = useNavigate();
  const param = useParams();
  
  const handleProfileClick = () => {
    setDpClick(toggle => !toggle);
  }


  
  const handleNavigation = () => {
    const oldEndPoint = param['*']?.split('/')[1];
    
    if (oldEndPoint !== _id) {
      navigate(`group/${_id}`);
    }
  }
  return (
    <div className=' flex items-center gap-x-3 px-4 pt-2'>
      <div className='w-11 h-[2.63rem] cursor-pointer'>
        <img className='  w-full h-full object-cover rounded-3xl ' onClick={handleProfileClick} src={avatar} alt="" />
      </div>
      {dbClick && <Dialog open={dbClick}>
        <img className=' w-52 h-full ' onClick={handleProfileClick} src={avatar} alt="Profile Pic" />
      </Dialog>}
      <div onClick={handleNavigation} className=' w-full border-b pb-2 border-collapse border-slate-500'>
        <p>{name}</p>
        {
          newMessages > 2 ? (
            <p>{newMessages} New Message</p>
          )
          :
          <p>{newMessageAlert}</p>
        }


        {
          isOnline && <span>O</span>
        }
      </div>
    </div>
  )
}

export default memo(GroupChat);