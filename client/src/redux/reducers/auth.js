import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user : null,
  isAdmin : false,
  loader : false,
  usersSearch : [] 
}
const authReducer = createSlice({
  name : 'authReducer',
  initialState : initialState,
  reducers : {
    addUser : (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    removeUser : (state) => {
      state.user = null;
      state.loader = false
    },
    addSearchUser : (state, action) => {
      state.usersSearch = action.payload;
    },
    removeSearchUserUser : (state, action) => {
      state.usersSearch = [];
    } 
  }
})

export const {addUser, removeUser, addSearchUser , removeSearchUserUser} = authReducer.actions;
export default authReducer.reducer; 