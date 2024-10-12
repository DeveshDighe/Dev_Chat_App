import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllMessages, setActiveChatID } from '../redux/reducers/usefull';
import { getChatDetail, getMessages } from '../tanstack/chats_logic';
import { NEW_MESSAGE, TYPING_MESSAGE, TYPING_SOPPED_MESSAGE } from '../constants/events';
import { useSocketEvents } from '../hooks/hook';
import { getSocket } from '../utils/socket';
import EditGroups from '../components/shared/EditGroup';
import ChattingInGroup from '../components/shared/ChattingInGroup';
import TypingComp from '../components/shared/TypingComp';
import AttachmentsMap from '../components/shared/AttachmentsMap';
import AttachmentContent from '../components/shared/AttachmentContent';
import AttachmentsMapGroup from '../components/shared/AttachmentsMapGroup';
import { addMessageCountAndNewMessage } from '../redux/reducers/chats';
import { useMediaQuery } from '@mui/material';
import ChatLoading from '../components/shared/ChatLoading';
import ClipLoader from "react-spinners/ClipLoader";
import { playPopUpSound, playPopUpSound2 } from '../lib/helper';

const Group = () => {
  const [page, setPage] = useState(1);
  const [prevGroupID, setPrevGroupID] = useState(null);
  const [userTyping, setUserTyping] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);
  const { groupID } = useParams();
  const {socket} = getSocket();
  let groupEditClicked = false;

  const { refetch, data, isLoading } = getChatDetail(groupID, true);
  const { refetch: refetchMessages, data: messageData , isFetching: messagesLoading} = getMessages(groupID, page);
  const { user } = useSelector((state) => state.authReducer);
  const { oldMessages } = useSelector((state) => state.usefullReducer);
  const { uploadingLoader } = useSelector((state) => state.randomReducer);
  const { chatDetail } = useSelector((state) => state.chatReducer);
  
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery('(max-width: 650px)'); // Detect screen size
  const isInitialLoad = useRef(true);
  const prevScrollHeightRef = useRef(0);

  useEffect(() => {
    if (groupID && prevGroupID !== groupID) {
      if (!isSmallScreen) {
        setAllMessages([]);
        dispatch(removeAllMessages());
        setPage(1);
        setPrevGroupID(groupID);
      }
    }
    if (groupID) {
      refetch();
      dispatch(setActiveChatID(groupID));
      refetchMessages();
    }
  }, [groupID, prevGroupID, refetch, refetchMessages, dispatch]);

  const saveScrollPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      prevScrollHeightRef.current = container.scrollHeight - container.scrollTop;
    }
  };

  const restoreScrollPosition = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
    }
  };

  useEffect(() => {

    return () => {
      if (isSmallScreen) {
      dispatch(removeAllMessages());
      setAllMessages([]);
      setPage(1);
      setPrevGroupID(groupID);
      }

    }
  }, [])

  // Handle old messages loading
  useEffect(() => {
    if (oldMessages && oldMessages.length > 0) {
      saveScrollPosition();
      setAllMessages(oldMessages);
      setTimeout(() => {
        restoreScrollPosition();
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
    if (data.message.chat === groupID) {
      const newMessage = data.message;

      // Check if user is at or near the bottom
      const container = containerRef.current;
      const isAtBottom = container && (container.scrollHeight - container.scrollTop - container.clientHeight < 50); // Threshold for being near bottom


      setAllMessages((prevData) => [...prevData, newMessage]);
      if (data.message.sender._id === user?._id) {
        playPopUpSound();
      }else{
        playPopUpSound2()
      }
      data = { ...data, currentChatID: groupID }
      dispatch(addMessageCountAndNewMessage(data));
      
      if (isAtBottom && container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight; // Scroll to the bottom
        }, 0);
      }



    }
  }, [groupID]);

  const TypingMessageListener = useCallback((data) => {
    setUserTyping(data.userName);
  }, [groupID]);
  
  const TypingMessageSoppedListener = useCallback((data) => {
    setUserTyping(null);
  }, [groupID]);

  const eventHandler = { [NEW_MESSAGE]: messageListener , 
    [TYPING_MESSAGE] : TypingMessageListener,
    [TYPING_SOPPED_MESSAGE] : TypingMessageSoppedListener,
  };
  useSocketEvents(socket, eventHandler);


  if (isLoading) {
    return <div>Loading...</div>;
  }



  const memberIds = data?.data?.members?.map((member) => member._id) || [];


  return (
    <div className='conta2 relative'>
      <div className='flex h-full flex-col element bg-[#eefffe]'>
        <div className='h-13 shadow'>
          <ChattingInGroup chattingInGroup={chatDetail} userTyping={userTyping} />
        </div>
        <div ref={containerRef} className="flex flex-col flex-grow space-y-4 p-4 px-1 overflow-auto relative scroll">
          {
            isSmallScreen
            ? messagesLoading
                ? <ChatLoading />
                : allMessages.length < 1
                ?
                <div className='flex justify-center'>
                      <span className='bg-[#ffea9c] text-[#545454] text-center px-4 rounded-md'>
                        Start conversation with friends
                      </span>
                    </div>
                    :
                allMessages.map((message, index) => {
                  const timeAgo = moment(message.createdAt).fromNow();

                  if (message.attachements && message.attachements.length > 0) {
                    const attachments = message.attachements;
                    return (
                      <React.Fragment key={`${message._id}-${index}`}>
                        <AttachmentsMapGroup attachments={attachments} message={message} user={user} timeAgo={timeAgo} />
                        {message?.content && <AttachmentContent user={user} message={message} timeAgo={timeAgo} />}
                      </React.Fragment>
                    );
                  }

                  return (
                    <div key={`${message._id}_${index}`} className={`${message?.sender._id === user?._id ? 'self-end  max-w-[55%]' : ' flex gap-x-2  max-w-[55%]'}`}>
                      {message?.sender._id !== user?._id &&
                        <div className=' w-6 h-6 mt-1'>
                          <img className=' w-full h-full object-cover rounded-3xl' src={message?.sender?.avatar?.url} alt="sender dp" />
                        </div>
                      }
                      <div className={` break-words max-w-full ${message?.sender._id === user?._id ? 'self-end bg-[#93d6fa] text-left' : 'self-start bg-[#9f90f3] text-left'} inline-block py-1 px-3 rounded-lg text-left`}>

                        <p className=' font-semibold text-[14px]'>{message?.sender._id === user?._id ? 'you' : `${message.sender.name}`}</p>
                        <p className=' '>{message?.content || message?.content}</p>
                        <p className='text-[10px] text-right ml-6 mt-1'>{timeAgo}</p>
                      </div>
                    </div>

                  );
                })
              :
              allMessages.length < 1 
                ?
                <div className=' flex justify-center'>
                <span className=' bg-[#ffea9c] text-[#545454] text-center px-4 rounded-md'>Start conversation with friends</span>
                </div>
                :
              allMessages.map((message, index) => {
                const timeAgo = moment(message.createdAt).fromNow();

                if (message.attachements && message.attachements.length > 0) {
                  const attachments = message.attachements;
                  return (
                    <React.Fragment key={`${message._id}-${index}`}>
                      <AttachmentsMapGroup attachments={attachments} message={message} index={index} user={user} timeAgo={timeAgo} />
                      {message?.content && <AttachmentContent user={user} message={message} timeAgo={timeAgo} />}
                    </React.Fragment>
                  );
                }

                return (
                  <div  key={message?._id} className={` ${message?.sender._id === user?._id ? 'self-end max-w-[55%]' : ' flex self-start gap-x-2 max-w-[55%]'}`}>
                    {message?.sender._id !== user?._id &&
                      <div className=' w-6 h-6 mt-1'>
                        <img className=' w-full h-full object-cover rounded-3xl' src={message?.sender?.avatar?.url} alt="sender dp" />
                      </div>
                    }
                    <div  className={`${message?.sender._id === user?._id ? 'self-end bg-[#93d6fa] text-left  break-words ' : 'self-start bg-[#9f90f3] text-left'} inline-block py-1 px-3 rounded-lg text-left max-w-full break-words`}>

                      <p className=' font-semibold text-[14px]'>{message?.sender._id === user?._id ? 'you' : `${message.sender.name}`}</p>
                      <p className=''>{message?.content || message?.content}</p>
                      <p className='text-[10px] text-right ml-6 mt-1'>{timeAgo}</p>
                    </div>
                  </div>

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
          <TypingComp chatID={groupID} members={memberIds} />
        </div>
      </div>
      {groupEditClicked &&
        <EditGroups chatDetail={chatDetail} />
      }
    </div>
  );
};

export default memo(Group);
