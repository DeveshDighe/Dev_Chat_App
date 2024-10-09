import React, { memo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { sampleChats } from '../../constants/sampleData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import DropDown from '../../lib/helper_components/DropDown';
import OneOnOneDropDown from '../../lib/helper_components/OneOnOneDropDown';


const ChattingWith = ({chattingWith, userTyping}) => {

  const [iconClicked, setIconClicked] = useState(false);
  const [dropDownData, setDropDownData] = useState(['Profile', 'Help', 'Report']);




  // const User = sampleChats.find((user) => user._id === ChatID);

  const User = chattingWith ? chattingWith[0] : ''; 
  
  const moreClicked = () => {
    setIconClicked(prev => !prev)
  }
  console.log(User?.status, 'User.status');
  
  
  return (
    <div className=' flex justify-between h-full bg-[#eff3f6] py-1 px-4'>
      <div className=' flex gap-x-3 items-center'>
      <div className=' w-9 h-9 relative'>
        <img className=' w-full h-full object-cover rounded-3xl' src={User?.avatar} alt="Profile pic" />
        {
          User?.status === 'ONLINE' && 
          <div className=' h-[0.6rem] w-[0.6rem] absolute bg-green-400 rounded-full bottom-0 right-0'>
        </div>
        }
        
      </div>
      <div>
        <p className=' font-semibold'>{User?.name}</p>
        {userTyping && <p className=' text-xs'>typing...</p>}
      </div>
      </div>
      <div className=' relative z-10'>
        <IconButtonsComp title={'More'} Iccon={MoreVertIcon} onClick={moreClicked}/>
        {iconClicked &&
        <OneOnOneDropDown User={User}  content={dropDownData}/>
      }
      </div>
      
    </div>
  )
}

export default memo(ChattingWith)