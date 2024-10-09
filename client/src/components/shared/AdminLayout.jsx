import React, { memo, useState } from 'react'

import SliderAdmin from '../../pages/admin/SliderAdmin';
import {Close as CloseIcon, Menu as MenuIcon,} from '@mui/icons-material'
import {Drawer} from '@mui/material'
import { Navigate } from 'react-router-dom';



const AdminLayout = ({children}) => {

  let isAdmin = true;

  if (!isAdmin) {
    return <Navigate to={'/admin/login'}/>
  }

  const [isMenuClicked, setIsMenuClicked] = useState(false);

  return (
    <div className=' w-full flex h-screen'>
      <div onClick={()=>setIsMenuClicked(prev => !prev)} className=' fixed top-2 right-2 lg:hidden z-100'>
        {isMenuClicked ? <CloseIcon/>: <MenuIcon/>}
      </div>
      <div className=' min-w-[280px] border max-lg:hidden'>
        <SliderAdmin/>
      </div>
      {isMenuClicked && (
  <Drawer open={isMenuClicked}  onClose={() => setIsMenuClicked(false)}>
    <div className="w-[250px] h-full">
      <SliderAdmin w="100vw" />
    </div>
  </Drawer>
)}
      <div>{children}</div>
    </div>
  )
}

export default memo(AdminLayout)