import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { sampleChats } from '../../constants/sampleData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import DropDown from '../../lib/helper_components/DropDown';

const ChattingWith = ({chattingWith}) => {

  const [iconClicked, setIconClicked] = useState(false);
  const [dropDownData, setDropDownData] = useState(['Edit', 'Help', 'Report']);




  // const User = sampleChats.find((user) => user._id === ChatID);

  const User = chattingWith[0]; 
  
  const moreClicked = () => {
    console.log('More clicked');
    setIconClicked(prev => !prev)
  }
  
  return (
    <div className=' flex justify-between h-full bg-[#eff3f6] py-1 px-4'>
      <div className=' flex gap-x-3 items-center'>
      <div className=' w-9 h-9'>
        <img className=' w-full h-full object-cover rounded-3xl' src={User.avatar} alt="Profile pic" />
      </div>
      <div>
        <p className=' font-semibold'>{User.name}</p>
      </div>
      </div>
      <div className=' relative z-10'>
        <IconButtonsComp title={'More'} Iccon={MoreVertIcon} onClick={moreClicked}/>
        {iconClicked &&
        <DropDown content={dropDownData}/>
      }
      </div>
      
    </div>
  )
}

export default ChattingWith