import React, { useEffect, useRef } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSelector } from 'react-redux';
import { makeAdmin, removeAdmin, removeMemberMutate } from '../../tanstack/chats_logic';
import { useParams } from 'react-router-dom';


const GroupMember = ({ member, creator, admins, moreClicked, setMoreClicked, setVisitProfileClicked }) => {

  const { user } = useSelector((state) => state.authReducer);
  const moreRef = useRef();

  const { groupID } = useParams();

  const { mutate } = removeMemberMutate();
  const { mutate: makeAdminMutate, isLoading: makeLoading } = makeAdmin();
  const { mutate: removeAdminMutate } = removeAdmin();

  const handleMoreClicked = () => {
    if (moreClicked !== member) {
      setMoreClicked(member);
      return;
    }
    setMoreClicked(null);
  };

  const handleMakeAdminClick = () => {
    const groupIDandUserID = { groupID: groupID, userID: member._id }
    makeAdminMutate(groupIDandUserID);
    setMoreClicked(null);
  };
  const handleRemoveAdmin = () => {
    const groupIDandUserID = { groupID: groupID, userID: member._id }
    removeAdminMutate(groupIDandUserID);
    setMoreClicked(null);
  };

  const handleProfileClick = () => {
    setVisitProfileClicked(member);
    setMoreClicked(null);
  };

  const handleUserRemove = () => {
    const data = { userToRemoveID: member?._id, chatID: groupID };
    mutate(data);
    setMoreClicked(null);
  };

  // Check if the member is an admin
  const isAdmin = admins.some(admin => admin._id === member._id);
  // console.log(member, isAdmin, 'Member and isAdmin');
  const Admin = admins.filter(admin => admin._id === member._id);
  return (
    <div className=' custom-md:w-[60%] w-[60%] m-auto flex justify-between'>
      <div className='flex gap-x-2 items-center text-sm'>
        <div className='w-6 h-6 mt-1 relative'>
          <img className='w-full h-full object-cover rounded-3xl' src={member?.avatar} alt='creator dp' />
          {member?.status === 'ONLINE' &&
            <div className='w-[0.5rem] h-[0.5rem] rounded-full absolute bottom-0 right-0 bg-green-400'>
            </div>
          }
        </div>
        <p>{member.name}</p>
      </div>
      <div className='cursor-pointer relative' ref={moreRef}>
        <MoreHorizIcon sx={{ color: '#3a3a3a' }} onClick={handleMoreClicked} />
        {(user._id === creator._id || isAdmin) ? (  // Check if the user is the creator or an admin
          <>
            {moreClicked?._id === member?._id && ( // Check if the dropdown is open for this member
              member._id === creator._id ? (  // Check if the member is the creator
                <div className='absolute text-sm w-28 border top-5 left-[-40px] bg-white z-10 rounded-md border-gray-400 overflow-hidden'>
                  
                  <p className='py-1 hover:bg-[#f1f1f1]'>Creator {moreClicked?._id === user?._id && <span className=' py-1 text-xs hover:bg-[#f1f1f1]'>{'( You )'}</span>}</p>
                  <p className='py-1 hover:bg-[#f1f1f1]'>Admin {moreClicked?._id === user?._id && <span className=' py-1 text-xs hover:bg-[#f1f1f1]'>{'( You )'}</span>}</p>
                  <p className='py-1 hover:bg-[#f1f1f1]' onClick={handleProfileClick}>Visit Profile</p>
                </div>
              ) : (
                <div className='absolute text-sm w-28 border top-5 left-[-40px] bg-white z-10 rounded-md border-gray-400 overflow-hidden'>
                  {isAdmin
                    ?
                    moreClicked?._id !== user?._id && <p className='py-1 text-red-600 hover:bg-[#f1f1f1]' onClick={handleRemoveAdmin}>Remove Admin</p>
                    :
                    <p className='py-1 hover:bg-[#f1f1f1] text-green-500' onClick={handleMakeAdminClick}>Make Admin</p>
                  }
                  <p className='py-1 hover:bg-[#f1f1f1]' onClick={handleProfileClick}>Visit Profile</p>
                  {moreClicked?._id !== user?._id ? <p className='py-1 hover:bg-[#f1f1f1] text-red-600' onClick={handleUserRemove}>Remove</p> : <p className=' py-1 hover:bg-[#f1f1f1]'>You</p>}
                </div>
              )
            )}
          </>
        ) : (
          moreClicked?._id === member?._id && ( // Check if the dropdown is open for this member
            <div className='absolute text-sm w-28 border top-5 left-[-40px] bg-white z-10 rounded-md border-gray-400 overflow-hidden'>
              {!isAdmin && member._id !== user._id && (
                <p className='py-1 hover:bg-[#f1f1f1] text-green-500' onClick={handleMakeAdminClick}>Make Admin</p>
              )}
              <p className='py-1 hover:bg-[#f1f1f1]' onClick={handleProfileClick}>Visit Profile</p>
              {!isAdmin && member._id !== user._id && (
                <p className='py-1 hover:bg-[#f1f1f1] text-red-600' onClick={handleUserRemove}>Remove</p>
              )}
              
              {/* {isAdmin && member._id !== creator._id && (
                <p className='py-1 text-red-600 hover:bg-[#f1f1f1]' onClick={handleRemoveAdmin}>Remove Admin</p>
              )} */}

            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GroupMember;
