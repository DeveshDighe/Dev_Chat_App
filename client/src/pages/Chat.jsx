import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import TypingComp from '../components/shared/TypingComp';
import moment from 'moment';
import { getChatDetail, getMessages } from '../tanstack/chats_logic';
import { getSocket } from '../utils/socket';
import { NEW_MESSAGE, TYPING_MESSAGE, TYPING_SOPPED_MESSAGE } from '../constants/events';
import { useSocketEvents } from '../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllMessages, setActiveChatID } from '../redux/reducers/usefull';
import AttachmentsMap from '../components/shared/AttachmentsMap';
import AttachmentContent from '../components/shared/AttachmentContent';
import ChattingWith from '../components/shared/ChattingWith';
import { addMessageCountAndNewMessage, removeChatDetail } from '../redux/reducers/chats';
import ChatLoading from '../components/shared/ChatLoading';
import { useMediaQuery } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';
import {playPopUpSound, playPopUpSound2} from '../lib/helper.js'

const Chat = () => {
  const [page, setPage] = useState(1);
  const [prevChatID, setPrevChatID] = useState(null);
  const [userTyping, setUserTyping] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);
  const param = useParams();
  const { socket } = getSocket();
  const { user } = useSelector((state) => state.authReducer);
  const { oldMessages, hasMoreMessages } = useSelector((state) => state.usefullReducer);
  const { uploadingLoader } = useSelector((state) => state.randomReducer);
  const { chatDetail } = useSelector((state) => state.chatReducer);

  const dispatch = useDispatch();
  const chatId = param.chatID;
  const chattingWith = chatDetail

  const { refetch, data, isLoading } = getChatDetail(chatId, true);
  const { refetch: refetchMessages, data: messageData, isFetching: messagesLoading } = getMessages(chatId, page);
  const isSmallScreen = useMediaQuery('(max-width: 650px)'); // Detect screen size

  const isInitialLoad = useRef(true);
  const prevScrollHeightRef = useRef(0);

  // Handle chat ID changes
  useEffect(() => {
    if (chatId && prevChatID !== chatId) {
      // dispatch(removeActiveChatID());
      if (!isSmallScreen) {
        dispatch(removeAllMessages());
        setAllMessages([]);
        setPage(1);
        setPrevChatID(chatId);
      }
    }
    if (chatId) {
      refetch();
      dispatch(setActiveChatID(chatId));
      refetchMessages();
    }

  }, [chatId, prevChatID, refetch, refetchMessages, dispatch]);



  useEffect(() => {

    return () => {
      if (isSmallScreen) {
        dispatch(removeAllMessages());
        setAllMessages([]);
        setPage(1);
        setPrevChatID(chatId);
      }
      dispatch(removeChatDetail());
    }
  }, [])

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

    console.log(data, chatId , 'popo');
    
    if (data.message.chat === chatId) {
      const newMessage = data.message;
      // Check if user is at or near the bottom
      const container = containerRef.current;
      const isAtBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 50); // Threshold for being near bottom

      // Add the new message to the chat
      if (data.message.sender._id === user._id) {
        playPopUpSound();
      }else{
        playPopUpSound2()
      }
      setAllMessages((prevData) => [...prevData, newMessage]);

      // If the user was at the bottom, scroll to the bottom after message is added
      if (isAtBottom && container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight; // Scroll to the bottom
        }, 0);
      }

      data = { ...data, currentChatID: chatId }
      dispatch(addMessageCountAndNewMessage(data));
    }


  }, [chatId]);

  const TypingMessageListener = useCallback((data) => {
    setUserTyping(true);
  }, [chatId]);

  const TypingMessageSoppedListener = useCallback((data) => {
    setUserTyping(false);
  }, [chatId]);

  const eventHandler = {
    [NEW_MESSAGE]: messageListener,
    [TYPING_MESSAGE]: TypingMessageListener,
    [TYPING_SOPPED_MESSAGE]: TypingMessageSoppedListener,
  };

  useSocketEvents(socket, eventHandler);


  const memberIds = data?.data?.members?.map((member) => member._id) || [];


  return (
    <div className='conta2 relative'>
      <div className='flex h-full flex-col element bg-[#eefffe]'>
        <div className='h-13 shadow'>
          <ChattingWith chattingWith={chattingWith} userTyping={userTyping} />
        </div>
        <div ref={containerRef} className={`flex flex-col flex-grow space-y-2 p-4 overflow-auto relative scroll max-md:px-1 ${allMessages.length < 1 && 'px-1'}`}>
          {
            isSmallScreen
              ? messagesLoading
                ? <ChatLoading /> // Show loader while messages are loading
                : allMessages?.length < 1
                  ? <div className='flex justify-center'>
                      <span className='bg-[#ffea9c] text-[#545454] text-center px-4 rounded-md'>
                        Start conversation with {chattingWith && chattingWith[0]?.name}
                      </span>
                    </div>
                  : allMessages.map((message, index) => {
                      const timeAgo = moment(message.createdAt).fromNow();
  
                      if (message.attachements && message.attachements.length > 0) {
                        const attachments = message.attachements;
                        return (
                          <React.Fragment key={`${message._id}-${index}`}>
                            <AttachmentsMap attachments={attachments} message={message} user={user} timeAgo={timeAgo} />
                            {message?.content && <AttachmentContent user={user} message={message} timeAgo={timeAgo} />}
                          </React.Fragment>
                        );
                      }
  
                      return (
                        <span
                          key={`${message._id}-${index}`}
                          className={`${message?.sender._id === user._id ? 'self-end bg-[#93d6fa]' : 'self-start bg-[#9f90f3]'} max-w-[55%] inline-block p-2 rounded-lg text-left`}
                        >
                          <div className='flex flex-col'>
                            <p className='text-wrap break-words'>{message?.content || message?.content}</p>
                            <p className='text-[10px] text-right mt-1'>{timeAgo}</p>
                          </div>
                        </span>
                      );
                    })
              : allMessages.length < 1
                ? <div className=' flex justify-center'>
                    <span className=' bg-[#ffea9c] text-[#545454] text-center px-4 rounded-md'>Start conversation with {chattingWith && chattingWith[0]?.name}</span>
                  </div>
                : allMessages.map((message, index) => {
                    const timeAgo = moment(message.createdAt).fromNow();
  
                    if (message.attachements && message.attachements.length > 0) {
                      const attachments = message.attachements;
                      return (
                        <React.Fragment key={`${message._id}-${index}`}>
                          <AttachmentsMap attachments={attachments} message={message} user={user} timeAgo={timeAgo} />
                          {message?.content && <AttachmentContent user={user} message={message} timeAgo={timeAgo} />}
                        </React.Fragment>
                      );
                    }
  
                    return (
                      <span
                        key={`${message._id}-${index}`}
                        className={`${message?.sender._id === user._id ? 'self-end bg-[#93d6fa] max-w-[55%]' : 'self-start bg-[#9f90f3]'} max-w-[55%] inline-block p-2 rounded-lg text-left`}
                      >
                        <div className='flex flex-col'>
                          <p className='text-wrap break-words'>{message?.content || message?.content}</p>
                          <p className='text-[10px] text-right mt-1'>{timeAgo}</p>
                        </div>
                      </span>
                    );
                  })
          }
        </div>
        <div className='h-14'>
          {uploadingLoader &&
            <div className='absolute left-[45%] bottom-16 z-30 text-center self-center flex items-center gap-x-2 bg-white px-3 rounded-md'>
              <ClipLoader
                color="#00b2ff"
                size={20}
                speedMultiplier={2}
              />
              <p className=' text-[16px]'>Sending...</p>
            </div>}
          <TypingComp chatID={chatId} members={memberIds} />
        </div>
      </div>
    </div>
  );
  

};

export default memo(Chat);
