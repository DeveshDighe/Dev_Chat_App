import React, { memo } from 'react'
import ChatItem from '../shared/ChatItem';

const ChatList = ({ chats=[]}) => {
  return (
    <div className=''>
      {chats?.map((data, index)=>{    
        const {avatar, name, _id,groupImg, groupChat, members, latestMessage, chats, newMessages,newMessageCount, status} = data;

        console.log(data , 'lslllddfdffd');
        
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
          userStatus={members.status}
        /> 
        )
      })}
    </div>
  )
}

export default memo(ChatList)