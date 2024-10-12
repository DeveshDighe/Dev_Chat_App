import React, { memo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { sampleChats } from '../../constants/sampleData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import DropDown from '../../lib/helper_components/DropDown';

const ChattingInGroup = ({chattingInGroup , userTyping}) => {

  const [iconClicked, setIconClicked] = useState(false);
  const [dropDownData, setDropDownData] = useState(['View', 'Help', 'Report']);




  // const User = sampleChats.find((user) => user._id === ChatID);

  const Group = chattingInGroup ? chattingInGroup : '';
  
  const moreClicked = () => {
    setIconClicked(prev => !prev)
  }
  
  return (
    <div className=' flex justify-between h-full bg-[#eff3f6] py-1 px-4'>
      <div className=' flex gap-x-3 items-center'>
      <div className=' w-9 h-9'>
        <img className=' w-full h-full object-cover rounded-3xl' src={Group.groupImg || 'https://wallpapers.com/images/featured/blank-white-background-xbsfzsltjksfompa.jpg'} alt="Profile pic" />
      </div>
      <div>
        <p className=' font-semibold'>{Group.name}</p>
        {userTyping !== null && <p className=' text-sm'>{userTyping} is typing...</p>}
      </div>
      </div>
      <div className=' relative z-10'>
        <IconButtonsComp title={'More'} Iccon={MoreVertIcon} onClick={moreClicked}/>
        {iconClicked &&
        <DropDown content={dropDownData} groupId={Group._id}/>
      }
      </div>
      
    </div>
  )
}

export default memo(ChattingInGroup);