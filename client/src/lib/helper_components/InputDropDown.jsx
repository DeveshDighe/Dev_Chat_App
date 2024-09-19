import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadingLoader } from '../../redux/reducers/random';
import { sendAttachment } from '../../tanstack/chats_logic';
import { setAttachments } from '../../redux/reducers/usefull';

const InputDropDown = ({ onFileSelect, setSelectedAttachments, selectedAttachments, chatID, content }) => {

  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null); // Added file input reference

  const dispatch = useDispatch();



  const handleFileInputClick = (type) => {
    if (type === 'Images') {
      imageInputRef.current.click();
    } else if (type === 'Audios') {
      audioInputRef.current.click();
    } else if (type === 'Videos') {
      videoInputRef.current.click();
    } else if (type === 'Files') { // Handle file input click
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    console.log(`Selected ${type}:`, files, files.length);
    if (files.length > 5) {
      return toast.error(`You can't select more than 5 ${type}`);
    }



    const myForm = new FormData();
    myForm.append('chatID', chatID);
    files.forEach((file) => myForm.append('files', file));

    setSelectedAttachments(`${files.length} ${type} selected`);
    dispatch(setAttachments(myForm));

    // onFileSelect(files); // Pass the selected files to the parent component
  };

  return (
    <ul className='absolute bottom-11 bg-yellow-200 w-28 left-4 flex flex-col rounded-md shadow-lg'>
      {selectedAttachments !== '' && <li>{selectedAttachments}</li>}
      <li className='p-2'>
        <p className='mb-1' onClick={() => handleFileInputClick('Images')}>Image</p>
        <input
          type='file'
          multiple
          accept='image/png, image/jpeg, image/gif'
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, 'Images')}
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
      <li className='p-2'>
        <p className='mb-1' onClick={() => handleFileInputClick('Audios')}>Audio</p>
        <input
          type='file'
          multiple
          accept='audio/mpeg, audio/wav, audio/ogg'
          ref={audioInputRef}
          onChange={(e) => handleFileChange(e, 'Audios')}
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
      <li className='p-2'>
        <p className='mb-1' onClick={() => handleFileInputClick('Videos')}>Video</p>
        <input
          type='file'
          multiple
          accept='video/mp4, video/webm, video/ogg'
          ref={videoInputRef}
          onChange={(e) => handleFileChange(e, 'Videos')}
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
      <li className='p-2'>
        <p className='mb-1' onClick={() => handleFileInputClick('Files')}>File</p>
        <input
          type='file'
          multiple
          accept='*'
          ref={fileInputRef} // Added file input ref
          onChange={(e) => handleFileChange(e, 'Files')} // Handle file change for files
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
    </ul>
  );
};

export default InputDropDown;
