import React, { memo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';

const InputDropDown = ({ onFileSelect, setSelectedAttachments, selectedAttachments, chatID, content , setAttchmentData}) => {

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
    if (files.length > 5) {
      return toast.error(`You can't select more than 5 ${type}`);
    }



    const myForm = new FormData();
    myForm.append('chatID', chatID);
    files.forEach((file) => myForm.append('files', file));

    setSelectedAttachments(`${files.length} ${type} selected`);
    setAttchmentData(myForm);

    // onFileSelect(files); // Pass the selected files to the parent component
  };

  return (
    <ul className='absolute bottom-11 bg-white text-gray-500 w-28 left-4 flex flex-col overflow-hidden rounded-md shadow cursor-pointer'>
      {selectedAttachments !== '' && <li className=' text-[12px] text-center p-1 text-[#0070ff]'>{selectedAttachments}</li>}
      <li className='p-2 px-3 flex justify-between items-center  hover:bg-[#f5f5f5]' onClick={() => handleFileInputClick('Images')}>
        <p className='mb-1' >Image</p>
        <ImageOutlinedIcon/>
        <input
          type='file'
          multiple
          accept='image/png, image/jpeg, image/gif'
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, 'Images')}
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
      <li className='p-2 px-3 flex justify-between items-center hover:bg-[#f5f5f5]' onClick={() => handleFileInputClick('Audios')}>
        <p className='mb-1' >Audio</p>
        <AudioFileOutlinedIcon/>

        <input
          type='file'
          multiple
          accept='audio/mpeg, audio/wav, audio/ogg'
          ref={audioInputRef}
          onChange={(e) => handleFileChange(e, 'Audios')}
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
      <li className='p-2 px-3 flex justify-between items-center hover:bg-[#f5f5f5]' onClick={() => handleFileInputClick('Videos')}>
        <p className='mb-1' >Video</p>
        <VideoCameraBackOutlinedIcon/>

        <input
          type='file'
          multiple
          accept='video/mp4, video/webm, video/ogg'
          ref={videoInputRef}
          onChange={(e) => handleFileChange(e, 'Videos')}
          style={{ display: 'none' }} // Hide the input element
        />
      </li>
      <li className='p-2 px-3 flex justify-between items-center hover:bg-[#f5f5f5]' onClick={() => handleFileInputClick('Files')}>
        <p className='mb-1' >File</p>
        <FilePresentOutlinedIcon/>

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

export default memo(InputDropDown);
