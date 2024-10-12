import {createSlice} from '@reduxjs/toolkit';

const initialState = {
 notificationsList : [],
 oldMessages : [],
 activeChatID : null,
 attachments : null,
 hasMoreMessages : false
}
const usefullReducer = createSlice({
  name : 'usefullReducer',
  initialState : initialState,
  reducers : {
    setNotificationsList: (state, action) => {
      
      // Check if the payload is an array
      if (Array.isArray(action.payload)) {
        state.notificationsList = action.payload; // Directly replace the list
      } else {
        // Check if there are existing notifications
        if (state.notificationsList.length > 0) {
          state.notificationsList = [...state.notificationsList, action.payload]; // Append new notification to the list
        } else {
          // If the list is empty, initialize it with the new payload
          state.notificationsList = [action.payload]; // Ensure the payload is added as an array
        }
      }    
    
    },
    removeNotificationsList : (state) => {
      state.notificationsList = [];
    },
    setHasMoreData : (state, action) => {
      state.hasMoreMessages = action.payload;
    },
    setActiveChatID : (state, action) => { 
      state.activeChatID = action.payload;
    },
    
    // removeActiveChatID : (state, action) => {
    //   state.activeChatID = null;
    // },
    setAllMessages: (state, action) => { 
      if (state.oldMessages || state.oldMessages.length > 0) {  
        // Append new messages to existing oldMessages
        state.oldMessages = [...action.payload, ...state.oldMessages];
      } else {
        // If oldMessages is empty, directly assign the payload
        state.oldMessages = action.payload;
      }
    },
    
    removeAllMessages : (state ) => { 
      state.oldMessages = [];
      
    },
  }
})

export const {setNotificationsList, removeNotificationsList, setHasMoreData , setAllMessages, removeAllMessages,setActiveChatID} = usefullReducer.actions;
export default usefullReducer.reducer; 