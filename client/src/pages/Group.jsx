import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllMessages } from '../redux/reducers/usefull';
import { getChatDetail, getMessages } from '../tanstack/chats_logic';
import { NEW_MESSAGE } from '../constants/events';
import { useSocketEvents } from '../hooks/hook';
import { getSocket } from '../utils/socket';
import EditGroups from '../components/shared/EditGroup';
import ChattingInGroup from '../components/shared/ChattingInGroup';
import TypingComp from '../components/shared/TypingComp';
import AttachmentsMap from '../components/shared/AttachmentsMap';
import AttachmentContent from '../components/shared/AttachmentContent';
import AttachmentsMapGroup from '../components/shared/AttachmentsMapGroup';
import { addMessageCountAndNewMessage } from '../redux/reducers/chats';

const Group = () => {
  const [page, setPage] = useState(1);
  const [prevGroupID, setPrevGroupID] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const containerRef = useRef(null);
  const { groupID } = useParams();
  const socket = getSocket();
  let groupEditClicked = false;


  const { user } = useSelector((state) => state.authReducer);
  const { oldMessages } = useSelector((state) => state.usefullReducer);
  const { uploadingLoader } = useSelector((state) => state.randomReducer);
  const { chatDetail } = useSelector((state) => state.chatReducer);

  const dispatch = useDispatch();

  const { refetch, data, isLoading } = getChatDetail(groupID, true);
  const { refetch: refetchMessages, data: messageData } = getMessages(groupID, page);

  const isInitialLoad = useRef(true);
  const prevScrollHeightRef = useRef(0);

  // Handle group ID changes
  useEffect(() => {
    if (groupID && prevGroupID !== groupID) {
      setAllMessages([]);
      dispatch(removeAllMessages());
      setPage(1);
      setPrevGroupID(groupID);
    }
    if (groupID) {
      refetch();
      refetchMessages();
    }
  }, [groupID, prevGroupID, refetch, refetchMessages, dispatch]);

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

      console.log(newMessage, 'newMessage newMessage');
      
      setAllMessages((prevData) => [...prevData, newMessage]);

      if (isAtBottom && container) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight; // Scroll to the bottom
        }, 0);
      }

      data = {...data, currentChatID : groupID}
      dispatch(addMessageCountAndNewMessage(data));

    }
  }, [groupID]);


  const eventHandler = { [NEW_MESSAGE]: messageListener };
  useSocketEvents(socket, eventHandler);

  // Handle scrolling to load more messages
  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      if (container.scrollTop === 0) {
        saveScrollPosition();
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

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
          <ChattingInGroup chattingInGroup={chatDetail} />
        </div>
        <div ref={containerRef} className="flex flex-col flex-grow space-y-4 p-4 overflow-auto relative">
          {allMessages.map((message, index) => {
            const timeAgo = moment(message.createdAt).fromNow();

            console.log(message, 'This is message off group');


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
              <div className={`${message?.sender._id === user._id ? 'self-end' : ' flex gap-x-2'}`}>
                {message?.sender._id !== user._id &&
                  <div className=' w-6 h-6 mt-1'>
                    <img className=' w-full h-full object-cover rounded-3xl' src={message?.sender?.avatar?.url} alt="sender dp" />
                  </div>
                }
                <div key={message?._id} className={`${message?.sender._id === user._id ? 'self-end bg-[#93d6fa] text-left' : 'self-start bg-[#9f90f3] text-left'} inline-block py-1 px-3 rounded-lg text-left`}>

                  <p className=' font-semibold text-[14px]'>{message?.sender._id === user._id ? 'you' : `${message.sender.name}`}</p>
                  <p className=' mr-10'>{message?.content || message?.content}</p>
                  <p className='text-[10px] text-right ml-6 mt-1'>{timeAgo}</p>
                </div>
              </div>

            );
          })}
        </div>
        <div className='h-14'>
          {uploadingLoader && <div className='absolute left-[45%] bottom-16 z-30 text-center self-center'>Loading</div>}
          <TypingComp chatID={groupID} members={memberIds} />
        </div>
      </div>
      {groupEditClicked &&
        <EditGroups chatDetail={chatDetail} />
      }
    </div>
  );
};

export default Group;
