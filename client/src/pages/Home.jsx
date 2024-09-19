import React from 'react'
import ChatList from '../components/specific/ChatList'
import { sampleChats } from '../constants/sampleData'
import { useParams } from 'react-router-dom'
import { getChatsList, getNotification } from '../tanstack/chats_logic'
import { useSelector } from 'react-redux'
import Friends from '../components/layout/Friends'

const Home = () => {
  const param = useParams();

  const chatId = param.chatID;

  const { chatsList } = useSelector((state) => state.chatReducer);
  const { newUserSearch } = useSelector((state) => state.randomReducer);


console.log(chatsList , 'This is chatList bro');

  const handleDeleteChat = (e, _id, gropChat) => {
    console.log('handleDeleteChat is hitted', _id);

  }

  // const { data, error } = getChatsList();
  const { data: notifications, error: notificationsError } = getNotification();

  return (
    <div className=' pb-2'>

      {newUserSearch ?
        <Friends />
        :
        chatsList?.length ?
          <ChatList
            chats={chatsList}
          />
          :
          <div>No chats</div>
      }
    </div>

  )
}

export default Home