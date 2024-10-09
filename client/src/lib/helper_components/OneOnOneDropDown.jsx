import { Dialog } from '@mui/material';
import React, { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserProfile from '../../components/shared/UserProfile';

const OneOnOneDropDown = ({ content = [], User }) => {
  const [visitProfile, setVisitProfile] = useState(false);
  const [visitProfileClicked, setVisitProfileClicked] = useState(null);
  const navigate = useNavigate();
  const handleListClick = (data) => {
    if (data === 'Profile') {
      setVisitProfile(true);
    }
  }
  return (
    <>
      <ul className=' absolute top-10 bg-[#ffffff] w-[6.5rem] right-4 flex flex-col rounded-md shadow overflow-hidden'>
        {
          content.map((list, index) => (
            <li key={`${list}_${index}`} onClick={() => handleListClick(list)} className={`py-2 px-3 hover:bg-[#f5f5f5] ${list === 'Profile' && 'cursor-pointer'}`} >{list}</li>
          ))
        }
      </ul>
      <Dialog open={visitProfile} onClose={() => setVisitProfile(false)}>
        <div className=' w-[300px] max-custom-xSmall:w-[220px] max-custom-lastSmall:w-[190px]'>
        <UserProfile userID={User._id} setVisitProfileClicked={setVisitProfileClicked} setVisitProfile={setVisitProfile}/>
        </div>
      </Dialog>
    </>
  )
}

export default memo(OneOnOneDropDown)