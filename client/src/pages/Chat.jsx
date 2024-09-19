import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import TypingComp from '../components/shared/TypingComp';
import moment from 'moment';
import { getChatDetail, getMessages } from '../tanstack/chats_logic';
import { getSocket } from '../utils/socket';
import { NEW_MESSAGE } from '../constants/events';
import { useSocketEvents } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllMessages, setActiveChatID } from '../redux/reducers/usefull';
import AttachmentsMap from '../components/shared/AttachmentsMap';
import AttachmentContent from '../components/shared/AttachmentContent';
import ChattingWith from '../components/shared/ChattingWith';
import { addMessageCountAndNewMessage } from '../redux/reducers/chats';

const Chat = () => {
  const [page, setPage] = useState(1);
  const [prevChatID, setPrevChatID] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);
  const param = useParams();
  const socket = getSocket();
  const { user } = useSelector((state) => state.authReducer);
  const { oldMessages, hasMoreMessages } = useSelector((state) => state.usefullReducer);
  const { uploadingLoader } = useSelector((state) => state.randomReducer);
  const { chatDetail } = useSelector((state) => state.chatReducer);

  const dispatch = useDispatch();
  const chatId = param.chatID;
  const chattingWith = chatDetail?.members?.filter((member) => member._id !== user._id);
  
  const { refetch, data, isLoading } = getChatDetail(chatId, true);
  const { refetch: refetchMessages, data: messageData } = getMessages(chatId, page);

  const isInitialLoad = useRef(true);
  const prevScrollHeightRef = useRef(0);

  // Handle chat ID changes
  useEffect(() => {
    if (chatId && prevChatID !== chatId) {
      setAllMessages([]);
      dispatch(removeAllMessages());
      // dispatch(removeActiveChatID());
      setPage(1);
      setPrevChatID(chatId);
    }
    if (chatId) {
      refetch();
      dispatch(setActiveChatID(chatId));
      refetchMessages();
    }
    
  }, [chatId, prevChatID, refetch, refetchMessages, dispatch]);



  useEffect(()=>{

    return () => {
      setAllMessages([]);
      
    }
  },[])

  // Save the current scroll position relative to the bottom
  const saveScrollPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      prevScrollHeightRef.current = container.scrollHeight - container.scrollTop;
    }
  };

  // Restore the scroll position to maintain user position
  const restoreScrollPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
    }
  };

  // Handle new data fetching
  useEffect(() => {
    if (oldMessages && oldMessages.length > 0) {
      saveScrollPosition(); // Save the scroll position before new data is loaded
      setAllMessages(oldMessages);
      setTimeout(() => {
        restoreScrollPosition(); // Restore the scroll position after new data is added
      }, 0);
    }
  }, [oldMessages]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (containerRef.current && isInitialLoad.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      isInitialLoad.current = false;
    }
  }, [allMessages]);

  // Handle new messages from socket
  const messageListener = useCallback((data) => {
    
    if (data.message.chat === chatId) {
      const newMessage = data.message;
      // Check if user is at or near the bottom
      const container = containerRef.current;
      const isAtBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 50); // Threshold for being near bottom
  
      // Add the new message to the chat
      setAllMessages((prevData) => [...prevData, newMessage]);
  
      // If the user was at the bottom, scroll to the bottom after message is added
      if (isAtBottom && container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight; // Scroll to the bottom
        }, 0);
      }
    }
    data = {...data, currentChatID : chatId}
    console.log('Chat called here');

      dispatch(addMessageCountAndNewMessage(data));
    

  }, [chatId]);
  

  const eventHandler = { [NEW_MESSAGE]: messageListener };
  useSocketEvents(socket, eventHandler);

  // Handle scrolling to load more messages
  // const handleScroll = () => {
  //   if (containerRef.current) {
  //     const container = containerRef.current;
  //     if (container.scrollTop === 0 && hasMoreMessages && allMessages?.length>19) {
  //       console.log(hasMoreMessages , 'hasMoreMessages hasMoreMessages hasMoreMessages hasMoreMessages hasMoreMessages hasMoreMessages hasMoreMessages', allMessages?.length , 'allMessages?.length allMessages?.length');
        
  //       // User has scrolled to the top, save scroll position and load more messages
  //       saveScrollPosition();
  //       setPage(prevPage => prevPage + 1);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (container) {
  //     container.addEventListener('scroll', handleScroll);
  //   }
  //   return () => {
  //     if (container) {
  //       container.removeEventListener('scroll', handleScroll);
  //     }
  //   };
  // }, [handleScroll]);    // problem is here

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (allMessages.length < 1) {
  //   return <div>No messages available</div>;
  // }

  const memberIds = data?.data?.members?.map((member) => member._id) || [];

  return (
    <div className='conta2 relative'>
      <div className='flex h-full flex-col element bg-[#eefffe]'>
        <div className='h-13'>
          <ChattingWith chattingWith={chattingWith} />
        </div>
        <div ref={containerRef} className="flex flex-col flex-grow space-y-2 p-4 overflow-auto relative ">
          {allMessages.map((message, index) => {
            const timeAgo = moment(message.createdAt).fromNow();

            if (message.attachements && message.attachements.length > 0) {
              const attachments = message.attachements;
              return (
                <React.Fragment key={`${message._id}-${index}`}>
                  <AttachmentsMap attachments={attachments} message={message} user={user} timeAgo={timeAgo}/>
                  {message?.content && <AttachmentContent user={user} message={message} timeAgo={timeAgo}/>}
                </React.Fragment>
              );
            }

            return (
              <span key={message?._id} className={`${message?.sender._id === user._id ? 'self-end bg-[#93d6fa] text-left' : 'self-start bg-[#9f90f3] text-left'} inline-block p-2 rounded-lg text-left`}>
                <p className=' mr-10'>{message?.content || message?.content}</p>
                <p className='text-[10px] text-right ml-3'>{timeAgo}</p>
              </span>
            );
          })}
        </div>
        <div className='h-14'>
          {uploadingLoader && <div className='absolute left-[45%] bottom-16 z-30 text-center self-center'>Loading</div>}
          <TypingComp chatID={chatId} members={memberIds} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
