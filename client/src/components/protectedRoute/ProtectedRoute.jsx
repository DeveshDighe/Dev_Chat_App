import React, { lazy, memo, Suspense, useCallback, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useMediaQuery, Drawer, IconButton } from '@mui/material'; // Add Drawer and IconButton
import TopHeader from '../layout/TopHeader';
import Home from '../../pages/Home';
import Chat from '../../pages/Chat';
import Empty from '../../pages/Empty';
import Group from '../../pages/Group';
import { getSocket } from '../../utils/socket';
import { useSocketEvents } from '../../hooks/hook';
import { ADDED_IN_GROUP, NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS, REFETCH_GROUP_DETAIL, USER_OFFLINE, USER_ONLINE } from '../../constants/events';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationsList } from '../../redux/reducers/usefull';
import { addMessageCountAndNewMessage, chatActive, chatDeactive } from '../../redux/reducers/chats';
import Profile from '../layout/Profile';
import IconButtonsComp from '../../lib/helper_components/IconButtons';
import MenuIcon from '@mui/icons-material/Menu'; // Add a Menu Icon for opening Drawer
import EditGroup from '../shared/EditGroup';
import { useQueryClient } from 'react-query';
import CreateGroup from '../layout/CreateGroup';
import Header from '../../components/layout/Header';
import NotFound from '../../pages/NotFound';

// const Header = lazy(() => import('../../components/layout/Header'));
// const NotFound = lazy(() => import('../../pages/NotFound'));

const ProtectedRoute = ({ user , token}) => {
  const param = useParams();
  const { '*': paramString } = param;
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State for Drawer
  const queryClient = useQueryClient();
  // Extracting chatID or groupID from the param
  const [type, id, extraID] = paramString ? paramString.split('/') : [];



  const { activeChatID } = useSelector((state) => state.usefullReducer);
  const { profileClicked, createGroup } = useSelector((state) => state.randomReducer);

  const dispatch = useDispatch();
  const { socket } = getSocket();
  const isSmallScreen = useMediaQuery('(max-width: 650px)'); // Detect screen size
  const isXsSmallScreen = useMediaQuery('(max-width: 550px)'); // Detect screen size

  const NewMessageListener = useCallback(
    (data) => {  
      if (data.message.sender._id !== user?._id && data.chatID !== activeChatID) {
        dispatch(addMessageCountAndNewMessage(data));
      }
    },
    [activeChatID, dispatch, user]
  );

  const NewRequestListener = useCallback(
    (data) => {
      dispatch(setNotificationsList(data));
    },
    [dispatch]
  );


  const RefetchGroupDetailListener = useCallback(
    (data) => {
      queryClient.invalidateQueries(['Group-non-members', extraID])
      queryClient.invalidateQueries(['Chat-details-Edit', extraID])
    },
    [dispatch]
  );
  const refetchChatsListListener = useCallback(
    (data) => {
      queryClient.invalidateQueries(['Chats-list'])
    },
    [dispatch]
  );
  const addedInGroupListener = useCallback(
    (data) => {
      queryClient.invalidateQueries(['Chats-list'])
      queryClient.invalidateQueries(['Chat-details', id])
    },
    [dispatch]
  );
  const userOnlineListener = useCallback(
    (data) => {
      dispatch(chatActive(data))
    },
    [dispatch]
  );
  const userOfflineListener = useCallback(
    (data) => {
      dispatch(chatDeactive(data))
    },
    [dispatch]
  );

  const eventHandler = {
    [NEW_MESSAGE_ALERT]: NewMessageListener,
    [NEW_REQUEST]: NewRequestListener,
    [REFETCH_GROUP_DETAIL]: RefetchGroupDetailListener,
    [ADDED_IN_GROUP]: addedInGroupListener,
    [REFETCH_CHATS]: refetchChatsListListener,
    [USER_ONLINE]: userOnlineListener,
    [USER_OFFLINE]: userOfflineListener,

  };

  useSocketEvents(socket, eventHandler);

  if (!token) {
    return <Navigate to={'/login'} />;
  }

  // Function to toggle drawer
  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  // Conditional rendering based on screen size and URL params for small screens
  return (
    <main className='h-screen border px-[5%] pt-6 mainBg max-custom-lg:px-0 max-custom-lg:pt-0'>
      <div className='grid grid-cols-10 max-2xl:grid-cols-8 conta max-custom-lg:h-full'>
        {!isSmallScreen ? (
          // Show the full layout when the screen is larger than 650px
          <>
            <div className='h-full col-span-3 flex justify-between max-custom-mdb:col-span-4'>
              <div className='w-14 bg-slate-300'>
                <Header />
              </div>
              <div className='bg-white h-full widthOfListDiv flex flex-col'>
                <div className={` ${profileClicked ? 'min-h-[60px]' : 'min-h-[90px]'} `}>
                  {profileClicked ?
                    (<div className=' text-2xl h-full font-semibold flex items-center px-3'>
                      Profile
                    </div>)
                    :
                    createGroup ?
                      (<div className=' text-2xl h-full font-semibold flex items-center justify-center px-3'>
                        Create Group
                      </div>)
                      :
                      (<TopHeader />)}
                </div>

                <div className='flex-grow h-44 overflow-auto scroll'>
                  {profileClicked ? (
                    <Profile />
                  ) : createGroup ? (
                    <CreateGroup />
                  ) : (
                    <Home />
                  )}
                </div>

              </div>
            </div>
            <div className='conta2 border col-span-7 max-2xl:col-span-5 max-custom-mdb:col-span-4'>
              {/* <Suspense fallback={<div>Loading....</div>}> */}
                <Routes>
                  <Route path='/' element={<Empty />} />
                  <Route path='/chat/:chatID' element={<Chat />} />
                  <Route path='/group/:groupID' element={<Group />} />
                  <Route path='/group/Edit/:groupID' element={<EditGroup />} />
                  <Route path='*' element={<NotFound />} />
                </Routes>
              {/* </Suspense> */}
            </div>
          </>
        ) : (
          // On small screens, show header in drawer
          <>
            <Drawer
              anchor="left"
              open={isDrawerOpen}
              onClose={toggleDrawer(false)}
            >
              <div className="w-14 h-full">
                <Header />
              </div>
            </Drawer>

            {(!id) ? (
              // Show the sidebar if no chatID or groupID is present
              <div className='h-full col-span-8 flex justify-between max-custom-mdb:col-span-8'>
                {!isXsSmallScreen &&
                  <div className='w-14 bg-slate-300'>
                    <Header />
                  </div>
                }
                <div className='bg-white h-full widthOfListDiv flex-grow flex flex-col'>
                  <div className='min-h-[90px]'>
                    {profileClicked ?
                    <div className=' text-2xl h-full font-semibold flex items-center px-3 justify-between'>
                      Profile
                      <IconButtonsComp Iccon={MenuIcon} title={'Menu'} onClick={toggleDrawer(true)} data={''} />
                    </div> 
                    : 
                    <TopHeader toggleDrawer={toggleDrawer} />}
                  </div>
                  <div className='flex-grow overflow-auto scrollbar-hide'>
                    {profileClicked ? (
                      <Profile />
                    ) : createGroup ? (
                      <CreateGroup />
                    ) : (
                      <Home />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Show chat or group content if chatID or groupID is present
              <div className='conta2 border col-span-8 max-custom-mdb:col-span-8 '>
                {/* <Suspense fallback={<div>Loading....</div>}> */}
                  <Routes>
                    <Route path='/' element={<Empty />} />
                    <Route path='/chat/:chatID' element={<Chat />} />
                    <Route path='/group/:groupID' element={<Group />} />
                    <Route path='/group/Edit/:groupID' element={<EditGroup />} />
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                {/* </Suspense> */}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default memo(ProtectedRoute);
