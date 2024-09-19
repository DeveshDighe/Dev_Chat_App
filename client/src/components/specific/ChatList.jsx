import React from 'react'
import ChatItem from '../shared/ChatItem';

const ChatList = ({ chats=[]}) => {
  return (
    <div className=''>
      {chats?.map((data, index)=>{
        console.log(data , 'popopopoopopopo');
        
        
        const {avatar, name, _id,groupImg, groupChat, members, latestMessage, chats, newMessages,newMessageCount} = data;

        return (
        <ChatItem 
        index={index}
          newMessageAlert={latestMessage} 
          isOnline={false} 
          avatar={avatar} 
          name={name} 
          _id={_id} 
          key={_id} 
          groupChat={groupChat} 
          newMessages={newMessages}
          groupImg={groupImg}
          newMessageCount={newMessageCount}
        /> 
        )
      })}
    </div>
  )
}

export default ChatList