import React, { useEffect, useState } from 'react'
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import { useQuery } from 'react-query';
import api from '../../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import { addSearchUser } from '../../redux/reducers/auth';
import { setNewUserSearch, setNotification, setSearch } from '../../redux/reducers/random';
import Notifications from './Notifications';
import { Dialog } from '@mui/material';
import { useSocketEvents } from '../../hooks/hook';
import { NEW_MESSAGE_ALERT } from '../../constants/events';
import { getChatsList } from '../../tanstack/chats_logic';


const TopHeader = () => {

  // const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchUserData, setUserSearchData] = useState('');
  const [searchData, setsearchData] = useState('');
  const [filter, setFilter] = useState(null);
  const [debounceInput, setDebounceInput] = useState('');
  const { notificationsList } = useSelector((state) => state.usefullReducer);

  const { search, newUserSearch, notification } = useSelector((state) => state.randomReducer);


  const dispatch = useDispatch();
  const {error, refetch : refetchChatList } = getChatsList(searchData, filter);


  
  const activeFilter = ' bg-green-200 py-1 px-3 rounded-2xl';
  const inActiveFilter = ' bg-[#EFF3F6] py-1 px-3 rounded-2xl';

  const handleSearchClick = () => {
    console.log('handleSearch clicked');
    // setIsSearchActive(toggle => !toggle);
    if (search) {
      dispatch(setSearch(false));
    } else {
      if (newUserSearch) {
        dispatch(setNewUserSearch(false));
      }
      if (notification) {
      dispatch(setNotification(false));
      }
      dispatch(setSearch(true));
    }
  }

  const handleNotificationClick = () => {
    console.log('handleNotification clicked', notification);
    if (notification) {
      dispatch(setNotification(false));
    } else {
      if (search) {
        dispatch(setSearch(false));
      }
      if (newUserSearch) {
      dispatch(setNewUserSearch(false));
      }
      dispatch(setNotification(true));
    }
  }

  const handleAddUserClick = () => {
    console.log('handleAddUserClick clicked');
    if (newUserSearch) {
      dispatch(setNewUserSearch(false));
    } else {
      if (search) {
        dispatch(setSearch(false));
      }
      if (notification) {
      dispatch(setNotification(false));
      }
      dispatch(setNewUserSearch(true));
    }
  }

  const searchUserDataFunc = async (searchQuery) => {
    try {
      const response = await api.get(`user/search-users?name=${searchQuery}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(()=>{
    refetchChatList();
  },[filter])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['Search'],
    queryFn: () => searchUserDataFunc(searchUserData),
    retry: 1,
    enabled: true,
    onSuccess: (data) => {
      // console.log('This is data after search', data);
      dispatch(addSearchUser(data.users));
    },
    onError: (err) => {
      console.log('This is error', err);
    }
  });





  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceInput(() => searchUserData);
      refetch();
    }, 1000);

    return () => {
      clearTimeout(timer);
      setDebounceInput('');
      }
  }, [searchUserData, refetch]);


  useEffect(() => {
    console.log(searchData , 's');
    
    const timer = setTimeout(() => {
      setDebounceInput(() => searchData);
      refetchChatList();
    }, 1000);

    return () => {
      clearTimeout(timer);
      setDebounceInput('');
      }
  }, [searchData, refetch]);




  return (
    <div className=' my-1  h-full w-[95%] m-auto'>
      <div className=' flex justify-between mb-2'>
        <p className=' font-bold text-[30px]'>Chats</p>
        <div>
          <IconButtonsComp Iccon={GroupAddOutlinedIcon} title={'Add New Chat'} onClick={handleAddUserClick} data={''} isClicked={newUserSearch} />
          <IconButtonsComp Iccon={SearchOutlinedIcon} title={'Search'} onClick={handleSearchClick} data={''} isClicked={search} />
          <IconButtonsComp Iccon={NotificationsNoneOutlinedIcon} title={'Notification'} onClick={handleNotificationClick} value={notificationsList.length} data={''} />
        </div>
      </div>

      {
        search &&
        <div className={`searchBar ${search ? 'active' : ''}`}>
          <input onChange={(e) => setsearchData(e.target.value)} className=' w-full h-full rounded-lg outline-none bg-transparent' placeholder='Search' type="text" />
        </div>
      }
      {
        newUserSearch &&
        <div className={`searchBarUser ${newUserSearch ? 'activeUser' : ''}`}>
          <input onChange={(e) => setUserSearchData(e.target.value)} className=' w-full h-full rounded-lg outline-none bg-transparent' placeholder='search users' type="text" />
        </div>
      }

      {
        !newUserSearch &&
        <div className=' flex gap-x-3 my-2'>
          <span className={filter === null ? activeFilter : inActiveFilter} onClick={()=>setFilter(null)}>All</span>
          <span className={filter === 'Chats' ? activeFilter : inActiveFilter} onClick={()=>setFilter('Chats')}>Chats</span>
          <span className={filter === 'Groups' ? activeFilter : inActiveFilter} onClick={()=>setFilter('Groups')}>Groups</span>
        </div>
      }



      {/* Conditional rendering */}
      {notification &&
        <Dialog open={notification} onClose={() => handleNotificationClick()}>
          <Notifications />
        </Dialog>
      }
    </div>
  )
}

export default TopHeader