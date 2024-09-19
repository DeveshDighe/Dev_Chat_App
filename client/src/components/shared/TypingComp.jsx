import React, { useEffect, useState } from 'react'
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import AddIcon from '@mui/icons-material/Add';
import { sampleChats } from '../../constants/sampleData';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import { getSocket } from '../../utils/socket';
import { NEW_MESSAGE } from '../../constants/events';
import InputDropDown from '../../lib/helper_components/InputDropDown';
import { sendAttachment } from '../../tanstack/chats_logic';
import { useDispatch, useSelector } from 'react-redux';
import { removeAttachments } from '../../redux/reducers/usefull';
import { setUploadingLoader } from '../../redux/reducers/random';

const TypingComp = ({ members ,  chatID ,}) => {
  const socket = getSocket();
  const [selectedAttachments , setSelectedAttachments] = useState('')
  const [message, setmessage] = useState('');
  const [fileClicked, setfileClicked] = useState(false);

  const {attachments} = useSelector((state)=>state.usefullReducer);

  const {mutate} = sendAttachment();
  const dispatch = useDispatch();



  const handleAttachFile = () => {
    console.log('Handle attach file clicked');
    setfileClicked(prev => !prev);
  }
  const handleSend = () => {
    // e.preventDefault();
    setfileClicked(false);

    if (attachments!==null) {
      dispatch(setUploadingLoader(true));
      attachments.append('content', message);
      mutate(attachments);
      dispatch(removeAttachments());
      setSelectedAttachments('')
      setmessage('')
      return
    }

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, {chatID, members, message});
    setmessage('');

  }

  useEffect(() => {
    console.log(message, "This is msg");

  }, [message])

  return (
    <div className=' w-full h-full gap-x-2  border flex bg-[#eff3f6] items-center'>
      <div className={' relative'}>
      <IconButtonsComp  title={'Add file'} Iccon={AttachFileIcon} onClick={handleAttachFile}/>
      {fileClicked && <InputDropDown selectedAttachments={selectedAttachments} setSelectedAttachments={setSelectedAttachments} chatID={chatID} content={message}/>}
      </div>
      <input className=' w-full h-10 rounded-lg outline-none bg-white my-1  px-3 text-sm' onChange={(e) => setmessage(e.target.value)}  value={message} placeholder='Type a message' type="text" />
      <IconButtonsComp className={'w-24'} title={'Add file'} Iccon={SendIcon} onClick={handleSend} />
    </div>
  )
}

export default TypingComp