import { Dialog } from '@mui/material';
import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { messagesReaded } from '../../redux/reducers/chats';

const ChatItem = ({ avatar = [], name, _id,groupImg, Lastmessage, groupChat, isOnline, sameSender, newMessageAlert, index, newMessageCount, handleDeleteChatOpen, newMessages}) => {

  const [dbClick, setDpClick] = useState(false);
  const navigate = useNavigate();
  const param = useParams();
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  
  const handleProfileClick = () => {
    setDpClick(toggle => !toggle);
  }

  
  const handleNavigation = () => {
    const oldEndPoint = param['*']?.split('/')[1];
    
    if (oldEndPoint !== _id) {
      dispatch(messagesReaded(_id));
      if (groupChat) {
        navigate(`/group/${_id}`);
      }else{
        navigate(`/chat/${_id}`);
      }
    }
  }
  return (
    <div className=' flex items-center gap-x-3 px-4 pt-2'>
      <div className='w-11 h-[2.63rem] cursor-pointer'>
        <img className='  w-full h-full object-cover rounded-3xl ' onClick={handleProfileClick} src={groupChat ? groupImg : avatar} alt="" />
      </div>
      {dbClick && <Dialog open={dbClick} onClose={handleProfileClick}>
        <img className=' w-52 h-full ' src={groupChat ? groupImg : avatar} alt="Profile Pic" />
      </Dialog>}
      <div onClick={handleNavigation} className=' w-full border-b pb-2 border-collapse border-slate-500'>
        <p>{name}</p>
        {
          newMessageCount > 2 ? (
            <p>{newMessageCount} New Message</p>
          )
          :
          
            newMessageAlert && <p>{newMessageAlert?.sender?.name === user?.name ? 'you' : newMessageAlert?.sender?.name} : {newMessageAlert?.content}</p>
          
          
        }


        {
          isOnline && <span>O</span>
        }
      </div>
    </div>
  )
}

export default memo(ChatItem);