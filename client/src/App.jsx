import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Loders from './components/layout/Loders';
import AdminLogin from './pages/admin/AdminLogin';
import { useSelector } from 'react-redux';
import { getUserData } from './tanstack/user_logic';
import {Toaster} from 'react-hot-toast';
import {SocketProvider} from './utils/socket'
import Login from '../src/pages/Login'
import Register from '../src/pages/Register'

// const Login = lazy(() => import('./pages/Login'));
// const Register = lazy(() => import('./pages/Register'));
const DashBoard = lazy(() => import('./pages/admin/DashBoard'));
const MessageManagement = lazy(() => import('./pages/admin/MessageManagement'));
const UsersManagement = lazy(() => import('./pages/admin/UserManagement'));
const ChatsManagement = lazy(() => import('./pages/admin/ChatManagement'));


const App = () => {
  const { user, loader } = useSelector((state) => state.authReducer);

  const token = localStorage.getItem('User-Token');

  const { data, error } = getUserData();

  return loader ? (
    <Loders />
  )
    :
    (
      <BrowserRouter>
        <Suspense fallback={<Loders />}>
          <Routes>
            <Route path='/login' element={<Login user={user} token={token} />} />
            <Route path='/register' element={<Register user={user} token={token}/>} />
            <Route path='/admin/login' element={<AdminLogin user={user} token={token} />} />
            <Route path='/admin/dashboard' element={<DashBoard />} />
            <Route path='/admin/users' element={<UsersManagement />} />
            <Route path='/admin/messages' element={<MessageManagement />} />
            <Route path='/admin/chats' element={<ChatsManagement />} />
            <Route path='*' 
            element={
              
                <ProtectedRoute user={user} token={token} />

              } />
          </Routes>
        </Suspense>
        <Toaster position='top center '/>
      </BrowserRouter>
    );
}

export default App;
