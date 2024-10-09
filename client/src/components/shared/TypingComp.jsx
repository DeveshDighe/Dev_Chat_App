import React, { memo, useEffect, useState } from 'react'
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import AddIcon from '@mui/icons-material/Add';
import { sampleChats } from '../../constants/sampleData';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { getSocket } from '../../utils/socket';
import { NEW_MESSAGE, TYPING_MESSAGE, TYPING_SOPPED_MESSAGE } from '../../constants/events';
import InputDropDown from '../../lib/helper_components/InputDropDown';
import { sendAttachment } from '../../tanstack/chats_logic';
import { useDispatch, useSelector } from 'react-redux';
import { removeAttachments } from '../../redux/reducers/usefull';
import { setUploadingLoader } from '../../redux/reducers/random';
import { messageSenderChatTop } from '../../redux/reducers/chats';

const TypingComp = ({ members ,  chatID ,}) => {
  const {socket} = getSocket();
  const [selectedAttachments , setSelectedAttachments] = useState('')
  const [message, setmessage] = useState('');
  const [fileClicked, setfileClicked] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useSelector((state) => state.authReducer);
 
  const {attachments} = useSelector((state)=>state.usefullReducer);

  const {mutate} = sendAttachment();
  const dispatch = useDispatch();



  const handleAttachFile = () => {
    setfileClicked(prev => !prev);
    console.log(attachments , 'attachments attachments');
    
  }
  const handleSend = () => {
    // e.preventDefault();
    setfileClicked(false);
    console.log(attachments , 'This is attaCHMENT');

    if (attachments!==null) {
      
      dispatch(setUploadingLoader(true));
      dispatch(messageSenderChatTop(chatID));
      attachments.append('content', message);
      mutate(attachments);
      dispatch(removeAttachments());
      setSelectedAttachments('')
      setmessage('')
      return
    }

    if (!message.trim()) return;    //if message is empty then return
    socket.emit(NEW_MESSAGE, {chatID, members, message});
    dispatch(messageSenderChatTop(chatID));
    setmessage('');

  }

  //message typing
  useEffect(()=>{
    if (message) {
      if (!isTyping) {
        console.log(user.name, 'user.name');
        
        socket.emit(TYPING_MESSAGE, {chatID, members, userName : user.name});
        setIsTyping(true);
      }
    }
    else{
      if (isTyping) {
        socket.emit(TYPING_SOPPED_MESSAGE, {chatID, members});
        setIsTyping(false);
      }
    }
  },[message])

  return (
    <div className=' w-full h-full gap-x-2 max-sm:gap-x-0 border flex bg-[#eff3f6] items-center shadow'>
      <div className={' relative'}>
      <IconButtonsComp  title={'Add file'} Iccon={AttachFileIcon} onClick={handleAttachFile}/>
      {fileClicked && <InputDropDown selectedAttachments={selectedAttachments} setSelectedAttachments={setSelectedAttachments} chatID={chatID} content={message}/>}
      </div>
      <input className=' w-full h-10 rounded-lg outline-none bg-white my-1  px-3 text-sm' onChange={(e) => setmessage(e.target.value)}  value={message} placeholder='Type a message' type="text" />
      <IconButtonsComp className={'w-24'} title={'Send'} Iccon={SendIcon} onClick={handleSend} />
    </div>
  )
}

export default memo(TypingComp)