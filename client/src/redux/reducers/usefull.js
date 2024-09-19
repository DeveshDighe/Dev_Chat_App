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
      console.log('set notification hit or not');
      
      // Check if the payload is an array
      if (Array.isArray(action.payload)) {
        console.log('Payload is an array, setting notifications list');
        state.notificationsList = action.payload; // Directly replace the list
      } else {
        // Check if there are existing notifications
        if (state.notificationsList.length > 0) {
          console.log(action.payload, 'This is action payload, appending to existing notifications');
          state.notificationsList = [...state.notificationsList, action.payload]; // Append new notification to the list
        } else {
          // If the list is empty, initialize it with the new payload
          console.log('No existing notifications, adding first notification');
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
      console.log('Action payload:', action.payload);  // Ensure chatId is being passed
      state.activeChatID = action.payload;
      console.log('Updated activeChatID:', state.activeChatID);
    },
    
    // removeActiveChatID : (state, action) => {
    //   state.activeChatID = null;
    // },
    setAllMessages: (state, action) => {
      console.log(action, 'This is the payload for messages');
      
      if (state.oldMessages || state.oldMessages.length > 0) {
        console.log('enterd here', action.payload);
        
        // Append new messages to existing oldMessages
        state.oldMessages = [...action.payload, ...state.oldMessages];
      } else {
        // If oldMessages is empty, directly assign the payload
        console.log(action.payload , 'This');
        
        state.oldMessages = action.payload;
      }
    },
    
    removeAllMessages : (state ) => {
      console.log('remove messages called');
      
      state.oldMessages = [];
      console.log(state, 'This is state after removel');
      
    },
    setAttachments : (state, action) => {
      state.attachments = action.payload;
    },
    removeAttachments : (state) => {
      state.attachments = null
    }
  }
})

export const {setNotificationsList, removeNotificationsList, setHasMoreData , setAllMessages, removeAllMessages,setActiveChatID, setAttachments , removeAttachments} = usefullReducer.actions;
export default usefullReducer.reducer; 