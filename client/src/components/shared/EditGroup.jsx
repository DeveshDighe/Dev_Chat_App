import React, { memo, useEffect, useRef, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow, IconButton, Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { addMemberMutate, getChatDetailEdit, leaveGroup } from '../../tanstack/chats_logic';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../constants/config';
import { useQuery, useQueryClient } from 'react-query';
import { ClipLoader } from 'react-spinners';
import GroupMember from './GroupMember';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Friends from '../layout/Friends';
import { addSearchUser } from '../../redux/reducers/auth';
import AddMembersGroup from '../layout/AddMembersGroup';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { ADDED_IN_GROUP } from '../../constants/events';
import UserProfile from './UserProfile';
import toast from 'react-hot-toast';

const EditGroup = () => {

  const [editClicked, setEditClicked] = useState(false);
  const [visitProfileClicked, setVisitProfileClicked] = useState(null);
  const [addMembersClicked, setAddMembersClicked] = useState(false);
  const [userNotInGroup, setUserNotInGroup] = useState([]);
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [moreClicked, setMoreClicked] = useState(null);
  const [confirmExit, setConfirmExit] = useState(false);
  const [searchUserData, setUserSearchData] = useState('');
  const [loading, setLoading] = useState(false);
  const changedName = useRef('');
  const queryClient = useQueryClient();
  const groupID = useParams().groupID;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { chatDetail } = useSelector((state) => state.chatReducer);
  const { user } = useSelector((state) => state.authReducer);


  const { refetch, data, isLoading } = getChatDetailEdit(groupID, true);
  const { mutate } = addMemberMutate();
  const { mutate : leaveGroupMutate } = leaveGroup();

  const handleEdit = () => {
    setEditClicked(prev => !prev);
  };
  const handleCloseAddmember = () => {
    setAddMembersClicked(false);
    setUsersToAdd([]);
  };
  const handleAddToGroup = () => {
    const memberIds = usersToAdd.map((user) => user._id);
    const dataToAddUser = { chatID: groupID, members: memberIds }
    mutate(dataToAddUser);
    setAddMembersClicked(false);
    setUsersToAdd([]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/chat/edit/${groupID}`, { name: changedName.current.value });
      if (response.data.status === 'success') {
        queryClient.invalidateQueries(['Chat-details-Edit', groupID]);
        queryClient.invalidateQueries(['Chats-list']);
        toast.success('Group name changed')
      }
      setEditClicked(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const getGroupNonMembersFunc = async (groupID, searchUserData) => {
    try {
      const response = await api.get(`chat/get-my-memberNotInGroup?name=${searchUserData}&chatID=${groupID}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  const { refetch: refetchGroupNonMem } = useQuery({
    queryKey: ['Group-non-members', groupID],
    queryFn: () => getGroupNonMembersFunc(groupID, searchUserData),
    staleTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setUserNotInGroup(data.friendsNotInGroup);
      queryClient.invalidateQueries(['Chat-details-Edit', groupID]);
    },
    onError: (err) => {
      console.log(err, 'error ');

    }
  })



  useEffect(() => {
    const timer = setTimeout(() => {
      refetchGroupNonMem();
    }, 1000);

    return () => {
      clearTimeout(timer);
    }
  }, [searchUserData, refetchGroupNonMem]);

  const handleConfirmExit = () => {
    leaveGroupMutate(groupID);
    setConfirmExit(false);
  }

  return (
    <div className='conta2 relative bg-[#f7f7f7] flex flex-col overflow-auto'>
      {
        visitProfileClicked ?
        <div className='custom-md:w-[380px] m-auto bg-white conta2 scroll flex flex-col text-center relative  p-4 max-h-[600px] max-sm:max-h-full max-sm:py-16 rounded-2xl shadow w-full'>
          <UserProfile setVisitProfileClicked={setVisitProfileClicked} userID={visitProfileClicked._id}/>
        </div>
        :
        <div className='custom-md:w-[380px] m-auto bg-white conta2 scroll flex flex-col text-center relative  p-4 px-1 max-h-[600px] max-sm:max-h-full max-sm:py-16 rounded-2xl shadow w-full'>
        <div className='flex justify-between px-4'>
          <Tooltip
            title={'Back'}
            placement="right"
            arrow
            aria-label={'Back'}
            TransitionComponent={Grow}
          >
            <IconButton sx={{ padding: '0px', color: 'black' }} onClick={() => navigate(-1)}>
              <KeyboardBackspaceOutlinedIcon />
            </IconButton>
          </Tooltip>
          <p className='text-xl ml-[-20px]'>Group Details</p>
          <p></p>
        </div>

        <div className='mt-4 flex-grow'>
          <div className='flex flex-col gap-y-3'>
            {editClicked ? (
              <div className='flex flex-col gap-y-2'>
                <input className='text-2xl font-semibold text-center w-[60%] mx-auto border border-gray-600 rounded-md outline-none' defaultValue={chatDetail?.name} ref={changedName} />
                <button className=' px-2 w-24 m-auto  rounded-md bg-green-500 text-white hover:bg-green-400' type="submit" onClick={handleSubmit}>Change</button>
              </div>
            ) : (
              <div className='flex gap-x-2 items-center text-sm justify-center'>
                <div className='w-8 h-8 mt-1'>
                  <img className='w-full h-full object-cover rounded-3xl' src={chatDetail?.groupImg} alt="group dp" />
                </div>
                <p className='text-2xl font-semibold text-center'>{chatDetail?.name}</p>
               <EditIcon fontSize='3px' sx={{ cursor: 'pointer', backgroundColor: '#e4e4e4', width: '25px', height: '25px', padding: '4px', borderRadius: '15px' }} onClick={handleEdit} />
              </div>
            )}

            {editClicked && (
              <p className='text-center' onClick={handleEdit}>
                <span className='bg-[#ff3c3c] text-white px-3 py-1 rounded-md cursor-pointer hover:bg-[#ff5858]'>Cancel</span>
              </p>
            )}
          </div>

          <div className='flex gap-x-1 justify-center mt-4 text-sm items-center'>
            <p>Created by: </p>
            <div className='flex gap-x-2 items-center text-sm'>
              <div className='w-6 h-6 mt-1'>
                <img className='w-full h-full object-cover rounded-3xl' src={chatDetail?.creator?.avatar?.url} alt="creator dp" />
              </div>
              <p>{chatDetail?.creator?.name}</p>
            </div>
          </div>
          <div className='flex gap-x-1 justify-center mt-4'>
            <p className='text-sm'>Created on: {formatDate(chatDetail?.createdAt)}</p>
          </div>

          <p className='mb-2 mt-6 text-sm'>Members</p>
          {
            addMembersClicked ?
              <>
                <div className='h-[170px]'>
                  <div className={`searchBarUserGroup activeUser`}>
                    <input onChange={(e) => setUserSearchData(e.target.value)} className=' w-full h-full rounded-lg outline-none bg-transparent' placeholder='search users' type="text" />
                  </div>
                  <AddMembersGroup usersToAdd={usersToAdd} userNotInGroup={userNotInGroup} setUsersToAdd={setUsersToAdd} />
                </div>
                <div className=' flex gap-x-2 justify-center w-full  flex-wrap mt-4 m-auto'>
                  {
                    usersToAdd.map((user) => (
                      <div className='flex gap-x-2 items-center text-sm'>
                        <div className='w-6 h-6 mt-1'>
                          <img className='w-full h-full object-cover rounded-3xl' src={user?.avatar.url} alt="creator dp" />
                        </div>
                        <p>{user?.name}</p>
                      </div>
                    ))
                  }
                </div>
                <div className=' flex gap-x-2 mt-2 justify-center'>
                  {usersToAdd.length > 0 && <button className=' px-2 border rounded-md bg-green-500 text-white' onClick={handleAddToGroup}>Add to group</button>}
                  <button className=' px-2 border rounded-md bg-red-500 hover:bg-red-400 text-white' onClick={() => handleCloseAddmember()}>Cancel</button>
                </div>
              </>
              :
              <>
                <div className=' overflow-auto h-[170px]  scroll'>
                  {chatDetail?.members.map((member) => (
                    <div className=' py-1 hover:bg-slate-100 cursor-pointer' key={member._id}>
                      {/* Group mebers list */}
                      <GroupMember member={member} admins={chatDetail?.admin} creator={chatDetail?.creator} moreClicked={moreClicked} setMoreClicked={setMoreClicked} setVisitProfileClicked={setVisitProfileClicked} />
                    </div>
                  ))}
                </div>
                {
                chatDetail?.creator._id === user._id && <button className=' py-0 px-2 rounded-md border mt-8 hover:bg-green-400 bg-green-500 text-white' onClick={() => setAddMembersClicked(true)}>Add members</button>
                }
              </>
          }


        </div>



        <div className='flex justify-center items-center mt-3'>
          <Tooltip
            title={'Leave Group'}
            placement="right"
            arrow
            aria-label={'Leave Group'}
            TransitionComponent={Grow}
          >
            <IconButton onClick={()=>setConfirmExit(true)}>
              <LogoutOutlinedIcon sx={{ color: 'red' }} />
            </IconButton>
          </Tooltip>

        </div>

        {loading && (
          <div className='absolute left-[45%] bottom-16 z-30 text-center flex items-center gap-x-2 bg-[#7eff7a] px-3 rounded-md'>
            <ClipLoader color="#000" size={20} speedMultiplier={2} />
            <p className='text-[16px]'>Updating...</p>
          </div>
        )}

        <Dialog open={confirmExit}>
          <DialogTitle>Confirm Leave</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave Group?
            </DialogContentText>
            <DialogContentText>
              <div className=' mt-3 mb-1'>
              Note : 
              </div>
            </DialogContentText>
            <DialogContentText>
              If you leave you can only see messages when you re-join group
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setConfirmExit(false)} color="primary">Cancel</Button>
            <Button onClick={handleConfirmExit} color="secondary">Leave</Button>
          </DialogActions>
        </Dialog>
      </div>
      }
      
    </div>
  );
}

export default memo(EditGroup);
