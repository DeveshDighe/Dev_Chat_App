import { Dialog } from '@mui/material';
import React, { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const DropDown = ({ content = [], groupId }) => {

  const navigate = useNavigate();
  const handleListClick = (data) => {
    if (data === 'View') {
      navigate(`/group/Edit/${groupId}`)    
    }
  }
  return (
    <>
    <ul className=' absolute top-10 bg-[#ffffff] w-[6.5rem] right-4 flex flex-col rounded-md shadow overflow-hidden'>
      {
        content.map((list, index) => (
          <li key={`${list}_${index}`} onClick={() => handleListClick(list)}  className={`py-2 px-3 hover:bg-[#f5f5f5] ${list === 'View' && 'cursor-pointer'}`} >{list}</li>
        ))
      } 
    </ul>
    </>
  )
}

export default memo(DropDown)