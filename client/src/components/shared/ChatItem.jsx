import { Dialog } from '@mui/material';
import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { messagesReaded } from '../../redux/reducers/chats';

const ChatItem = ({ avatar = [], name, _id, groupImg, Lastmessage, groupChat, isOnline, sameSender, newMessageAlert, index, newMessageCount, handleDeleteChatOpen, newMessages ,userStatus}) => {

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
      } else {
        navigate(`/chat/${_id}`);
      }
    }
  }

  
  return (
    <div className='flex items-center gap-x-3 pl-2 pt-1 max-sm:pt-[0.3rem] hover:bg-[#f1f1f1]'>
      {/* Profile Image */}
      <div className='w-[2.6rem] h-[2.67rem] max-sm:w-[2.1rem] max-sm:h-[2.17rem] flex-shrink-0 cursor-pointer relative'>
        <img className='w-full h-full object-cover rounded-3xl' onClick={handleProfileClick} src={groupChat ? groupImg : avatar} alt="" />
        {
          userStatus === 'ONLINE' && 
          <div className=' w-[0.6rem] h-[0.6rem] rounded-full absolute bottom-0 right-0 bg-green-400'>

          </div>
        }
      </div>

      {/* Profile Dialog */}
      {dbClick && <Dialog open={dbClick} onClose={handleProfileClick}>
        <img className='w-52 h-full' src={groupChat ? groupImg : avatar} alt="Profile Pic" />
      </Dialog>}

      {/* Message Content */}
      <div onClick={handleNavigation} className='flex-grow border-b mt-1 pb-[0.6rem] max-sm:pb-1 border-[#dfdfdf] overflow-hidden'>
        <p>{name}</p>

        {/* New Message Count or Alert */}
        {
          newMessageCount > 2 ? (
            <p>{newMessageCount} New Message</p>
          ) : (
            newMessageAlert ? (
              <p className={`text-ellipsis max-sm:mb-1 overflow-hidden whitespace-nowrap mt-[-2px] ${newMessageCount > 0 ? 'text-[#181818] font-[500]' : 'text-[#6a6a6a] font-light'}`}>
                ~{newMessageAlert?.sender?.name === user?.name ? 'you' : newMessageAlert?.sender?.name}: {newMessageAlert?.content}
              </p>
            )
            :
            // Just for padding even if the message is not present
            <p className=' py-2'></p>
          )
        }

        {/* Online Indicator */}
        {isOnline && <span>O</span>}
      </div>
    </div>

  )
}

export default memo(ChatItem);