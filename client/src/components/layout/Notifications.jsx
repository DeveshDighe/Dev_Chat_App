import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/reducers/random';
import { Dialog } from '@mui/material';
import { acceptFriendRequest } from '../../tanstack/chats_logic';

const Notifications = () => {
  const { notificationsList } = useSelector((state) => state.usefullReducer);
  const [profileClicked, setprofileClicked] = useState(null);

  const {mutate}= acceptFriendRequest();

  const handleProfileClick = (image) => {
    if (profileClicked === null) {
      setprofileClicked(image);
    } else {
      setprofileClicked(null);
    }
  }

  const handleAcceptRequest  = (id, accept) => {
    const data = {requestID : id, accept : accept}
    mutate(data);
  }

  return (
    <div className=' w-80 p-2'>
      <p className=' text-center pb-4'>Friend requests</p>
      {
        notificationsList?.length ?
        notificationsList?.map((notification) => (
          <div className=' flex items-center justify-between py-1' >
            <div className=' flex items-center gap-x-3'>
              <div onClick={() => handleProfileClick(notification.sender.avatar)} className="w-10 h-10 rounded-full overflow-hidden">
                <img className="object-cover w-full h-full" src={notification?.sender?.avatar} alt="" />
              </div>

            <div>
              <p>{notification?.sender?.name}</p>
            </div>
            </div>

            <div className=' flex gap-x-2'>
              <button onClick={()=>handleAcceptRequest(notification._id, true)} className=' py-1 px-2  text-center  bg-green-500 text-white text-sm rounded-sm'>Accept</button>
              <button onClick={()=>handleAcceptRequest(notification._id, false)} className=' py-1 px-2 bg-red-500  text-center text-white text-sm rounded-sm'>Reject</button>
            </div>
          </div>
        ))
        :
        <div className=' h-64 w-full flex items-center justify-center'>
          No Friend Requests
        </div>
      }

      <Dialog open={profileClicked} onClose={handleProfileClick}>
        <img className=' w-64 h-full ' onClick={handleProfileClick} src={profileClicked} alt="Profile Pic" />
      </Dialog>
    </div>
  )
}

export default Notifications