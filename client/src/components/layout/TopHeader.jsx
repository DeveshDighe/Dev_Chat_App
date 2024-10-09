import React, { memo, useEffect, useState } from 'react'
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
import { Badge, Dialog, Grow, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSocketEvents } from '../../hooks/hook';
import { NEW_MESSAGE_ALERT } from '../../constants/events';
import { getChatsList } from '../../tanstack/chats_logic';
import MenuIcon from '@mui/icons-material/Menu'; // Add a Menu Icon for opening Drawer



const TopHeader = ({ toggleDrawer }) => {

  // const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchUserData, setUserSearchData] = useState('');
  const [searchData, setsearchData] = useState('');
  const [filter, setFilter] = useState('All');
  const [debounceInput, setDebounceInput] = useState('');
  const { notificationsList } = useSelector((state) => state.usefullReducer);

  const { search, newUserSearch, notification, createGroup } = useSelector((state) => state.randomReducer);


  const dispatch = useDispatch();
  const { error, refetch: refetchChatList } = getChatsList(searchData, filter);

  const isXsSmallScreen = useMediaQuery('(max-width: 550px)'); // Detect screen size


  const activeFilter = ' bg-[#b6bbff] py-1 px-3 rounded-2xl cursor-pointer hover:bg-[#c4c8ff]';
  const inActiveFilter = ' bg-[#EFF3F6] py-1 px-3 rounded-2xl cursor-pointer hover:bg-[#dddfe1]';

  const handleSearchClick = () => {
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
    if (notification) {
      dispatch(setNotification(false));
    } else {
      if (search) {
        dispatch(setSearch(false));
      }
      // if (newUserSearch) {
      //   dispatch(setNewUserSearch(false));
      // }
      dispatch(setNotification(true));
    }
  }

  
  const handleToggle = () => {
    toggleDrawer(true)
  }

  const searchUserDataFunc = async (searchQuery) => {
    try {
      const response = await api.get(`user/search-users?name=${searchQuery}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    refetchChatList();
  }, [filter])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['Search'],
    queryFn: () => searchUserDataFunc(searchUserData),
    retry: 1,
    enabled: true,
    onSuccess: (data) => {
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
        {!createGroup && <p className=' font-bold text-[30px] max-sm:text-[26px] mb-2'>Chats</p>}
        {createGroup && <p className=' font-semibold text-[30px] max-sm:text-[22px] mb-2 mt-1'>Create Group</p>}
        <div>
        {!createGroup && <IconButtonsComp Iccon={SearchOutlinedIcon} title={'Search'} onClick={handleSearchClick} data={''} isClicked={search} /> }
          <Tooltip
                title="Notification"
                placement="right"
                arrow
                aria-label="notification"
                TransitionComponent={Grow}
              >
                <IconButton onClick={() => handleNotificationClick()} >
                {notificationsList.length ? <Badge badgeContent={notificationsList.length} color='error'> {<NotificationsNoneOutlinedIcon/>}</Badge> :<NotificationsNoneOutlinedIcon />}
                  
                </IconButton>
              </Tooltip>
          {
            isXsSmallScreen && <IconButtonsComp Iccon={MenuIcon} title={'Menu'} onClick={toggleDrawer(true)}  data={''} />
          }
          
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
          <input onChange={(e) => setUserSearchData(e.target.value)} className=' w-full h-full font-[300] rounded-lg outline-none bg-transparent' placeholder='search users' type="text" />
        </div>
      }

      {
        (!newUserSearch && !createGroup) &&
        <div className=' flex gap-x-3 my-2'>
          <span className={filter === 'All' ? activeFilter : inActiveFilter} onClick={() => setFilter('All')}>All</span>
          <span className={filter === 'Chats' ? activeFilter : inActiveFilter} onClick={() => setFilter('Chats')}>Chats</span>
          <span className={filter === 'Groups' ? activeFilter : inActiveFilter} onClick={() => setFilter('Groups')}>Groups</span>
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

export default memo(TopHeader);