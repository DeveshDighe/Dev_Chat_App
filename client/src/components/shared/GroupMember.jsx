import React, { memo, useRef } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSelector } from 'react-redux';
import { makeAdmin, removeAdmin, removeMemberMutate } from '../../tanstack/chats_logic';
import { useParams } from 'react-router-dom';

const GroupMember = ({
  member,
  creator,
  admins,
  moreClicked,
  setMoreClicked,
  setVisitProfileClicked
}) => {
  const { user } = useSelector((state) => state.authReducer);
  const moreRef = useRef();
  const { groupID } = useParams();

  const { mutate } = removeMemberMutate();
  const { mutate: makeAdminMutate } = makeAdmin();
  const { mutate: removeAdminMutate } = removeAdmin();

  // Check if the member is an admin
  const isAdmin = admins.some((admin) => admin._id === member._id);
  const isCurrentUserAdmin = admins.some((admin) => admin?._id === user?._id);

  const handleMoreClicked = () => {
    setMoreClicked(moreClicked?._id === member?._id ? null : member);
  };

  const handleMakeAdminClick = () => {
    if (member._id === user._id) {
      return; // Prevent making the current user admin
    }
    makeAdminMutate({ groupID, userID: member._id });
    setMoreClicked(null);
  };

  const handleRemoveAdmin = () => {
    if (member._id === user._id) {
      return; // Prevent removing the current user from admin
    }
    removeAdminMutate({ groupID, userID: member._id });
    setMoreClicked(null);
  };

  const handleProfileClick = () => {
    setVisitProfileClicked(member);
    setMoreClicked(null);
  };

  const handleUserRemove = () => {
    if (member._id === user._id) {
      return; // Prevent removing the current user from the group
    }
    mutate({ userToRemoveID: member._id, chatID: groupID });
    setMoreClicked(null);
  };

  const renderRoleLabel = () => {
    if (member._id === creator._id) {
      return <p className="py-1 hover:bg-[#f1f1f1]">Creator</p>;
    } else if (isAdmin) {
      return <p className="py-1 hover:bg-[#f1f1f1]">Admin</p>;
    }
    return null;
  };

  return (
    <div className='custom-md:w-[60%] w-[60%] m-auto flex justify-between'>
      <div className='flex gap-x-2 items-center text-sm'>
        <div className='w-6 h-6 mt-1 relative'>
          <img className='w-full h-full object-cover rounded-3xl' src={member?.avatar} alt='creator dp' />
          {member?.status === 'ONLINE' &&
            <div className='w-[0.5rem] h-[0.5rem] rounded-full absolute bottom-0 right-0 bg-green-400'></div>}
        </div>
        <p>{member.name}</p>
      </div>

      <div className='cursor-pointer relative' ref={moreRef}>
        <MoreHorizIcon sx={{ color: '#3a3a3a' }} onClick={handleMoreClicked} />

        {/* Dropdown Menu */}
        {(user?._id === creator._id || isCurrentUserAdmin) ? (
          <>
            {moreClicked?._id === member?._id && (
              member._id === creator._id ? (
                <div className='absolute text-sm w-28 border top-5 left-[-40px] bg-white z-10 rounded-md border-gray-400 overflow-hidden'>
                  <p className='py-1 hover:bg-[#f1f1f1]'>Creator</p>
                  <p className='py-1 hover:bg-[#f1f1f1]'>Admin</p>
                  <p className='py-1 hover:bg-[#f1f1f1]' onClick={handleProfileClick}>Visit Profile</p>
                </div>
              ) : (
                <div className='absolute text-sm w-28 border top-5 left-[-40px] bg-white z-10 rounded-md border-gray-400 overflow-hidden'>
                  {isAdmin && member._id !== user._id && (
                    <p className='py-1 text-red-600 hover:bg-[#f1f1f1]' onClick={handleRemoveAdmin}>Remove Admin</p>
                  )}
                  {!isAdmin && member._id !== user._id && (
                    <p className='py-1 hover:bg-[#f1f1f1] text-green-500' onClick={handleMakeAdminClick}>Make Admin</p>
                  )}
                  <p className='py-1 hover:bg-[#f1f1f1]' onClick={handleProfileClick}>Visit Profile</p>
                  {member._id !== user._id && (
                    <p className='py-1 hover:bg-[#f1f1f1] text-red-600' onClick={handleUserRemove}>Remove</p>
                  )}
                  {renderRoleLabel()}
                </div>
              )
            )}
          </>
        ) : (
          (
            <div className='absolute text-sm w-28 border top-5 left-[-40px] bg-white z-10 rounded-md border-gray-400 overflow-hidden'>
              {/* Make Admin is hidden if the member is already an admin */}
              {isCurrentUserAdmin && !isAdmin && member._id !== user._id && (
                <p className='py-1 hover:bg-[#f1f1f1] text-green-500' onClick={handleMakeAdminClick}>Make Admin</p>
              )}
              <p className='py-1 hover:bg-[#f1f1f1]' onClick={handleProfileClick}>Visit Profile</p>
              {isCurrentUserAdmin && member._id !== user._id && (
                <p className='py-1 hover:bg-[#f1f1f1] text-red-600' onClick={handleUserRemove}>Remove</p>
              )}
              {renderRoleLabel()}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default memo(GroupMember);
