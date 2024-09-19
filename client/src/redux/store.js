import {configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import chatReducer from './reducers/chats';
import randomReducer from './reducers/random';
import usefullReducer from './reducers/usefull';


const store = configureStore({
  reducer : {
    authReducer,
    chatReducer,
    randomReducer,
    usefullReducer
  }
});

export default store;