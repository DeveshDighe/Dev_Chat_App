import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { sampleChats } from '../constants/sampleData';
import ChattingWith from '../components/shared/ChattingWith';
import EditGroups from '../components/shared/EditGroup'
import TypingComp from '../components/shared/TypingComp';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import AttachmentContent from '../components/shared/AttachmentContent';
import AttachmentsMap from '../components/shared/AttachmentsMap';

import { fileFormat } from '../lib/features';
import RenderAttachment from '../lib/helper_components/RenderAttachment';
import ChattingInGroup from '../components/shared/ChattingInGroup';
import { getChatDetail, getMessages } from '../tanstack/chats_logic';
import { removeAllMessages } from '../redux/reducers/usefull';
import { useInfiniteScrollTop } from '6pp';
import { NEW_MESSAGE } from '../constants/events';
import { useSocketEvents } from '../hooks/hook';
import { getSocket } from '../utils/socket';

const Group = () => {

  const [page, setPage] = useState(1);
  const param = useParams();
  let groupEditClicked = false;
  const socket = getSocket();

  const groupID = param.groupID;
  console.log(groupID , 'groupIDiddidididididididiididididididididididididididiidididididididididididididididididididi');
  
  const containerRef = useRef(null);

  const [messages, setMessages] = useState([]);

  const { user } = useSelector((state) => state.authReducer);
  
  const { chatDetail } = useSelector((state) => state.chatReducer);
  const { oldMessages } = useSelector((state) => state.usefullReducer);
  const { uploadingLoader } = useSelector((state) => state.randomReducer);


  const dispatch = useDispatch();


  console.log(chatDetail, 'This is chat Detail');
  const chattingWith = chatDetail?.members?.filter((member) => member._id !== user._id);

  const { refetch, data , isLoading} = getChatDetail(groupID, true);
  const { refetch: refetchMessages, data: messageData } = getMessages(groupID, page);


  console.log(data , 'data data data data');
  
  // Ref to keep track of scroll position
  const scrollOffsetRef = useRef(0);

  useEffect(() => {
    if (groupID) {
      refetch();
      refetchMessages();
    }

    return () => {
      setMessages([]);
      dispatch(removeAllMessages());
      setPage(1);
      infiniteSetData([]);
      
    }
  }, [groupID]);


  console.log(oldMessages, 'This is oldMessages');


  const { data: infiniteData, setData: infiniteSetData } = useInfiniteScrollTop(
    containerRef,
    messageData?.totalPages,
    page,
    setPage,
    oldMessages
  );

  console.log(infiniteData , 'infiniteData 11111111111111111111111111111111111111111111111111111111111111');
  
  // useEffect(() => {
  //   if (messageData) {
  //     // infiniteSetData((prevData) => [...prevData, ...messageData.messages]);
  //   }
  // }, [messageData]);



  const messageListener = useCallback((data) => {
    if (data.message.chat === groupID) { // add new message from socket only if the chat id is same as param.chatId
      const newMessage = data.message;
    // Add the new message to infiniteData
    infiniteSetData((prevData) => [...prevData, newMessage]);

    // Optionally scroll to the bottom after new message is added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    }
      
    
  }, [infiniteSetData, groupID]);

  const eventHandler = { [NEW_MESSAGE]: messageListener };
  useSocketEvents(socket, eventHandler);


  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Save the scroll position before new messages are added
      scrollOffsetRef.current = container.scrollHeight - container.scrollTop;
    }
  }, [page]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      // Restore scroll position after messages update
      container.scrollTop = container.scrollHeight - scrollOffsetRef.current;
    }
  }, [infiniteData]);

  if (isLoading) {
    return(
      <div>jajajaj</div>
    )
  }
  const memberIds = data.data.members.map((member)=> {
    return member._id;
  });

  




  return (
    <div className=' conta2 relative'>
      <div className=' flex h-full flex-col bg-red-300'>
        <div className='h-13'>
          <ChattingInGroup chattingInGroup={chatDetail} />
        </div>
        <div ref={containerRef} className="flex flex-col flex-grow space-y-2 p-4 overflow-auto relative">
          {infiniteData?.map((message, index) => {
            const timeAgo = moment(message.createdAt).fromNow();

            // console.log(message , 'message');
            
            if (message.attachements || message.attachements?.length>0) {
              
              const attachments = message.attachements;
              // const file = fileFormat(url);
              // console.log('yes its a attachment', attachments);
              
              return (
                <React.Fragment key={`${message._id}-${index}`}>
                  <AttachmentsMap attachments={attachments} message={message} user={user} timeAgo={timeAgo}/>
              
                  {/* Conditionally render the message content if present */}
                  {message?.content && <AttachmentContent user={user} message={message} timeAgo={timeAgo}/>}
                </React.Fragment>
              );
              
            }
            return (
              <span key={message._id} className={`${message?.sender._id === user._id ? 'self-end bg-[#93d6fa] text-left' : 'self-start bg-[#9f90f3] text-left'} inline-block p-2 rounded-lg text-left`}>
                <div>
                  <img src={message.sender.avatar.url} alt="" />
                </div>
                {message?.content ? message.content : message?.content}
                <p className='text-[10px] text-right ml-3'>{timeAgo}</p>
              </span>
            );
          })}

        </div>
        <div className='h-14'>
        <TypingComp chatID={groupID} members={memberIds} />
        </div>
      </div>
      {groupEditClicked &&
        <EditGroups chatDetail={chatDetail} />
      }
    </div>

  )
}

export default Group;
