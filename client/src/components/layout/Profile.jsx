import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/reducers/auth';
import { setChatClicked, setProfileClicked } from '../../redux/reducers/random';
import { getSocket } from '../../utils/socket';

const Profile = () => {
  const { user } = useSelector((state) => state.authReducer);
  const [imageClicked, setImageClicked] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const {disconnectSocket} = getSocket();


  const dispatch = useDispatch();

  const handleImageClick = () => {
    setImageClicked(prev => !prev);
  };

  const handleLogOutClick = () => {
    setConfirmLogout(true); 
  };

  const handleConfirmLogOut = () => {
    dispatch(setProfileClicked(false))
    dispatch(setChatClicked(true))
    localStorage.removeItem('User-Token');
    disconnectSocket()
    dispatch(removeUser());
    setConfirmLogout(false);
  };

  const handleCancelLogOut = () => {
    setConfirmLogout(false);
  };

  return (
    <div className='py-4 min-h-full bg-[#f5f5f5] flex flex-col'>
      <div className='w-44 h-44 rounded-full border overflow-hidden mx-auto'>
        <img onClick={handleImageClick} className='w-full h-full object-cover' src={user?.avatar.url} alt="profile pic" />
      </div>
      <Dialog open={imageClicked} onClose={handleImageClick}>
        <img className='w-96 h-full' src={user?.avatar.url} alt="Profile Pic" />
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
      <div className='bg-white p-1 px-4 my-4'>
        <p onClick={handleLogOutClick} className='text-[#ff4040] py-1 cursor-pointer'>Logout</p>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={confirmLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogOut} color="primary">Cancel</Button>
          <Button onClick={handleConfirmLogOut} color="secondary">Logout</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default memo(Profile);
