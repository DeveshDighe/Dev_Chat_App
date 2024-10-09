import React, { memo } from 'react'
import ChatList from '../components/specific/ChatList'
import { sampleChats } from '../constants/sampleData'
import { useParams } from 'react-router-dom'
import { getNotification } from '../tanstack/chats_logic'
import { useSelector } from 'react-redux'
import Friends from '../components/layout/Friends'
import CreateGroup from '../components/layout/CreateGroup'

const Home = () => {
  const param = useParams();

  const chatId = param.chatID;

  const { chatsList } = useSelector((state) => state.chatReducer);
  const { newUserSearch, createGroup } = useSelector((state) => state.randomReducer);



  const handleDeleteChat = (e, _id, gropChat) => {
    console.log('handleDeleteChat is hitted', _id);

  }

  const { data: notifications, error: notificationsError } = getNotification();



  return (
    <div className=' pb-2 h-full overflow-auto scroll'>


      {newUserSearch ?
        <Friends />
        :
          chatsList?.length ?
            <ChatList
              chats={chatsList}
            />
            :
            <div className=' flex flex-col justify-center items-center h-[300px] gap-y-3  text-2xl font-semibold'>
              <p>No friends</p>
              <p>create friends and chat</p>
            </div>
      }
    </div>

  )
}

export default memo(Home)