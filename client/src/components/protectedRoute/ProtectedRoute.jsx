
import React, { lazy, Suspense, useCallback } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Title from '../shared/Title';
import { Box, Container, Grid } from '@mui/material'
import TopHeader from '../layout/TopHeader';
import Home from '../../pages/Home';
import Chat from '../../pages/Chat';
import Empty from '../../pages/Empty';
import Group from '../../pages/Group'
import { getSocket } from '../../utils/socket';
import { useSocketEvents } from '../../hooks/hook';
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from '../../constants/events';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationsList } from '../../redux/reducers/usefull';
import { addMessageCountAndNewMessage } from '../../redux/reducers/chats';
// const Home = lazy(() => import('../../pages/Home'));
// const Chat = lazy(() => import('../../pages/Chat'));
// const Group = lazy(() => import('../../pages/Group'));
const Header = lazy(() => import('../../components/layout/Header'));
const NotFound = lazy(() => import('../../pages/NotFound'));

const ProtectedRoute = ({ user }) => {

  const param = useParams();
  const {activeChatID} = useSelector((state)=>state.usefullReducer);

  console.log(activeChatID , '[]][]]}{}{}{}{}{}{}{}{}{][][[][][]');
  


  


  const dispatch = useDispatch();
  const socket = getSocket();


  const NewMessageListener = useCallback((data) => {
    console.log('Protected called here' , 'data.chatID', data.chatID , activeChatID, 'activeChatID', activeChatID);
    
    if (data.message.sender._id !== user._id && data.chatID !== activeChatID) {
      dispatch(addMessageCountAndNewMessage(data));
    }
    console.log(data, 'Ths is data off new messages listeneer');

    
  }, [activeChatID])

  const NewRequestListener = useCallback((data) => {
    console.log(data, 'new friend requset received');
    
    dispatch(setNotificationsList(data))
  }, [])

  


  const eventHandler = {
    [NEW_MESSAGE_ALERT]: NewMessageListener,
    [NEW_REQUEST]: NewRequestListener,
  };
  useSocketEvents(socket, eventHandler);

  if (!user) {
    return <Navigate to={'/login'} />
  }



  // console.log(socket, 'socket id');


  return (
    <main className=' h-screen border  px-24 pt-6 bg-green-400'>
      <div className=' grid grid-cols-8 conta '>
        <div className=' h-full overflow-hidden  col-span-3 flex justify-between'>
          <div className=' w-14 bg-slate-300'><Header /></div>
          <div className=' bg-white h-full w-full flex flex-col'>
            <div className=' min-h-[90px]'><TopHeader /></div>
            <div className='flex-grow  overflow-auto scrollbar-hide'>
              <Home />
            </div>
          </div>
        </div>
        <div className='conta2 border col-span-5'>
          <Suspense fallback={<div>Loading....</div>}>
            <Routes>
              <Route path='/' element={<Empty />} />
              <Route path='/chat/:chatID' element={<Chat />} />
              <Route path='/group/:groupID' element={<Group />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </main>
  )


}

export default ProtectedRoute