import {createSlice} from '@reduxjs/toolkit';

const initialState = {
 search : false,
 newUserSearch : false,
 notification : false,
 uploadingLoader : false,
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
    setNotification : (state, action) => {
      state.notification = action.payload;
    },
    setUploadingLoader : (state, action) => {
      state.uploadingLoader = action.payload
    }
  }
})

export const {setSearch, setNotification,setUploadingLoader, setNewUserSearch} = randomReducer.actions;
export default randomReducer.reducer; 