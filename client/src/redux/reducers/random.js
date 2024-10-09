import {createSlice} from '@reduxjs/toolkit';

const initialState = {
 search : false,
 newUserSearch : false,
 notification : false,
 uploadingLoader : false,
 profileClicked : false,
 chatClicked : false,
 editGroup : false,
 createGroup : false,
}
const randomReducer = createSlice({
  name : 'randomReducer',
  initialState : initialState,
  reducers : {
    setSearch : (state, action) => {
      state.search = action.payload;
    },
    setNewUserSearch : (state, action) => {
      state.newUserSearch = action.payload;
    },
    setProfileClicked : (state,action) => {
      console.log('enterd');
      
        state.profileClicked = action.payload;
    },
    setChatClicked : (state,action) => {
        state.chatClicked = action.payload;;
    },
    setCreateGroupClicked : (state,action) => {
        state.createGroup = action.payload;;
    },
    setNotification : (state, action) => {
      state.notification = action.payload;
    },
    setUploadingLoader : (state, action) => {
      state.uploadingLoader = action.payload
    },
    setEditGroup : (state, action) => {
      state.editGroup = action.payload
    }
  }
})

export const {setSearch, setNotification,setUploadingLoader, setNewUserSearch, setProfileClicked,setChatClicked, setEditGroup, setCreateGroupClicked} = randomReducer.actions;
export default randomReducer.reducer; 