import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Tooltip, Grow } from '@mui/material';
import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/reducers/auth';
import { setChatClicked, setProfileClicked } from '../../redux/reducers/random';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useQuery } from 'react-query';
import api from '../../constants/config';

const UserProfile = ({ userID, setVisitProfileClicked , setVisitProfile}) => {

  const [imageClicked, setImageClicked] = useState(false);


  const getUserDetail = async (userID) => {
    try {
      const response = await api.get(`/user/get-user-profile-detail?userID=${userID}`)
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile-detail', userID],
    queryFn: () => getUserDetail(userID),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (err) => {
      console.log(err, 'error ');
    }
  })


  const handleImageClick = () => {
    setImageClicked(prev => !prev);
  };
  const handleBack = () => {
    setVisitProfileClicked(null);
    setVisitProfile(false);
  };


  if (isLoading) {
    return <div>Loading....</div>
  }
  return (
    <div className='pb-4 min-h-full bg-[#f5f5f5] flex flex-col'>
      <div className=' flex gap-x-2 pt-2 items-center bg-white mb-4 pb-3 px-2'>
        <p>
          <Tooltip
            title={'Back'}
            placement="left"
            arrow
            aria-label={'Back'}
            TransitionComponent={Grow}
          >
            <KeyboardBackspaceIcon className=' cursor-pointer' onClick={() => handleBack()} />
          </Tooltip>
        </p>
        <p>Profile</p>
      </div>
      <div className='w-44 min-h-[175px] rounded-full border overflow-hidden mx-auto cursor-pointer'>
        <img onClick={handleImageClick} className='w-full h-full object-cover ' src={user?.avatar.url} alt="profile pic" />
      </div>
      <Dialog open={imageClicked} onClose={handleImageClick}>
        <img className='w-96 h-full cursor-pointer' src={user?.avatar.url} alt="Profile Pic" />
      </Dialog>
      <div className='bg-white p-1 px-4 my-4'>
        <p className='text-[#9d40ff] py-1'>your name</p>
        <p className='py-2'>{user?.name}</p>
      </div>
      <div className='bg-white p-1 px-4 my-4'>
        <p className='text-[#9d40ff] py-1'>username</p>
        <p className='py-2'>{user?.username}</p>
      </div>
      <div className='bg-white p-1 px-4 my-4'>
        <p className='text-[#9d40ff] py-1'>bio</p>
        <p className='py-2'>{user?.bio}</p>
      </div>

    </div>
  );
};

export default memo(UserProfile);
