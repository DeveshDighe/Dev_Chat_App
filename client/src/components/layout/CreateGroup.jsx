import { CameraAlt } from '@mui/icons-material'
import { Avatar, IconButton, Stack } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { VisuallyHiddenInput } from '../styles/StyledComponent'
import { useFormik } from 'formik'
import { getAllUsers } from '../../tanstack/user_logic'
import CloseIcon from '@mui/icons-material/Close';
import { createGroup } from '../../tanstack/chats_logic'
import ClipLoader from 'react-spinners/ClipLoader'
import toast from 'react-hot-toast'

const CreateGroup = () => {

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [members , setMembers] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);

  const {mutate : creategroupMutate, isLoading : createGroupLoading} = createGroup();

  const { errors, values, handleSubmit, handleChange, touched, setFieldValue } = useFormik({
    initialValues: { groupName: '', avatar: '' },
    // validationSchema : RegisterSchema,
    onSubmit: (value, action) => {
      if (value.groupName === '') {
        return toast.error('Group name is required');
      }
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('groupName', value.groupName);
      const memberIds = members.map((member)=> member._id)   
      formData.append('members', JSON.stringify(memberIds)); // Since members is an array, we stringify it

      creategroupMutate(formData); // Your mutation logic here
    }
    
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFieldValue('avatar', imageUrl);
      setFile(file);
    }
  };

  const {data, isLoading, mutate} = getAllUsers()


  useEffect(() => {

    const timer = setTimeout(() => {
      mutate(name);
    }, 1000);
  
    return () => {
      clearTimeout(timer);
    }
  }, [name])
  
  const handleAddMember = (user) => {
    if (!members.find((member) => member._id === user?._id)) {
      setMembers([...members, user]);
    }
  };
  const handleRemoveMember = (user) => {
    const usersAfterFilter = members.filter((member)=> member._id !== user?._id);
    setMembers(usersAfterFilter);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);
  return (
    <div className=' p-2 scroll relative'>
      <form onSubmit={handleSubmit} className=' scroll'>
        <div className=' flex justify-center'>
        <input className=' w-[80%] border outline-none font-[300] p-1 rounded-md' type="text" placeholder='Enter group name' name="groupName" value={values.groupName} onChange={handleChange} />
        </div>
        <p className=' text-center text-lg mt-2'>{values.groupName}</p>
        <Stack position={'relative'} width={'10rem'} margin={'auto'} marginY={'20px'}>
          <Avatar sx={{
            width: '10rem',
            height: '10rem',
            objectFit: 'contain'
          }}
            src={values.avatar}
          />
          <IconButton component='label' sx={{
            position: "absolute",
            bottom: "0",
            right: "0",
            color: "white",
            bgcolor: "rgba(0,0,0,0.5)",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}>
            <>
              <CameraAlt />
              <VisuallyHiddenInput type='file' name='avatar' accept='image/*' onChange={handleFileChange} />
            </>
          </IconButton>
        </Stack>
        <div className=' flex gap-x-2 justify-center flex-wrap gap-y-2 mb-3 scroll'>
          {members.map((member)=>(
            <div key={member._id} className=' py-0 px-2 rounded-sm flex gap-x-1 bg-red-300 items-center'>
              <p>{member.name}</p>
              <span onClick={()=>handleRemoveMember(member)} className=' cursor-pointer'>
              <CloseIcon sx={{fontSize : '15px'}}/>
              </span>
              </div>
          ))}
        </div>
        <div className=' flex justify-center relative' ref={dropdownRef}>
        <input className=' w-[80%] border outline-none font-[300] p-1 rounded-md' placeholder={'Search users to add'} onFocus={() => setIsFocused(true)} type="text" onChange={(e)=>setName(e.target.value)} />
        {isFocused &&
        <div className=' absolute top-8 bg-gray-100  w-[80%] max-h-40 overflow-auto scroll'>
          {
            isLoading ?
            <div className=' flex justify-center items-center h-36'>
              <ClipLoader
                color="#00b2ff"
                size={20}
                speedMultiplier={2}
              />
            </div>
            :
            data?.users.map((user)=> (
              <div key={user?._id} className=' cursor-pointer hover:bg-white py-1' onClick={() => handleAddMember(user)}>{user?.name}</div>
            ))
          }
        </div>
}
        </div>
        
        <div className=' flex justify-center'>
        <input disabled={createGroupLoading && true} className=' border py-1 px-3 rounded-md mt-4 bg-green-500 text-white' type="submit" value={'Create Group'} />
        </div>
      </form>
      {createGroupLoading &&
            <div className='absolute justify-center w-[90%] m-auto bottom-[-30px] z-30 text-center self-center flex items-center gap-x-2 bg-white px-3 rounded-md '>
              <ClipLoader
                color="#00b2ff"
                size={20}
                speedMultiplier={2}
              />
              <p className=' text-[16px]'>Creating group...</p>
            </div>}
    </div>
  )
}

export default CreateGroup