import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatsList: [],
  chatDetail: null,
};

const chatReducer = createSlice({
  name: 'chatReducer',
  initialState,
  reducers: {
    addChatsList: (state, action) => {
      state.chatsList = action.payload;
    },
    addMessageCountAndAleartFromLocal: (state, action) => {
      const localData = localStorage.getItem('chatData'); // Assuming chatData is an array of objects [{ chatID, messageCount }]

      if (!localData) {
        // If localStorage is not available, set newMessageCount to 0 for each chat
        state.chatsList = state.chatsList.map(chat => ({
          ...chat,
          newMessageCount: chat.newMessageCount || 0 // Set default to 0 if not already set
        }));
      } else {
        // Parse localStorage data
        const storedChatData = JSON.parse(localData); // Array of chat data from localStorage

        // Update chatsList with the message count from localStorage if chatID matches
        state.chatsList = state.chatsList.map(chat => {
          const matchingChat = storedChatData.find(item => item.chatID === chat._id); // Match by chat ID

          if (matchingChat) {
            return {
              ...chat,
              newMessageCount: matchingChat.newMessageCount // Use the message count from localStorage
            };
          }

          // If no match, retain current newMessageCount or set to 0
          return {
            ...chat,
            newMessageCount: chat.newMessageCount || 0
          };
        });
      }
    },

    addMessageCountAndNewMessage: (state, action) => {
      const { chatID, message, currentChatID } = action.payload;
    

      const chatIndex = state.chatsList.findIndex(chat => chat?._id === chatID);
      
      const updatedMessage = {
        ...message,
        content: message.content === "" ? "Attachment" : message.content // Check message.content, not message
      };

      if (chatIndex !== -1) {
        const chat = state.chatsList[chatIndex];
        const isCurrentChat = chatID === currentChatID;
    
        // Create a new chat object with updated latestMessage
        let updatedChat = {
          ...chat,
          latestMessage: updatedMessage, // Always update the latest message
          newMessageCount: isCurrentChat ? 0 : (chat.newMessageCount || 0) + 1 // Increment count only if it's not the current chat
        };
    
        // Move the updated chat to the top of the list, regardless of currentChatID
        state.chatsList.splice(chatIndex, 1); // Remove the chat from its current position
        state.chatsList.unshift(updatedChat); // Add it to the top
    
        // Log the updated state of chatsList
              
      }

      const localData = localStorage.getItem('chatData');
      let storedChatData = localData ? JSON.parse(localData) : [];

      const chatIndexLocal = storedChatData.findIndex(item => item.chatID === chatID);
      if (chatIndexLocal !== -1) {
        // Only update newMessageCount in localStorage if chatID !== currentChatID
        if (chatID !== currentChatID) {
          storedChatData[chatIndexLocal].newMessageCount += 1;
        }
      } else {
        storedChatData.push({ chatID, newMessageCount: chatID === currentChatID ? 0 : 1 });
      }

      localStorage.setItem('chatData', JSON.stringify(storedChatData));
    },
    

    messageSenderChatTop : (state, action) => {
      const chatID = action.payload;

      const chatIndex = state.chatsList.findIndex(chat => chat._id === chatID);
      const chat = state.chatsList[chatIndex];

      state.chatsList.splice(chatIndex, 1);
      state.chatsList.unshift(chat);
      return
    },

    chatActive : (state, action) => {
      state.chatsList = state.chatsList.map((chat)=>{
        if (chat.members._id === action.payload._id) {    
          return {...chat, members: {
            ...chat.members, // Spread the existing members object
            status: "ONLINE", // Override the status property
          }}
        }
        return chat;
      })

      if (state.chatDetail !== null) {
        state.chatDetail[0] = {
          ...state.chatDetail[0], // Spread the existing properties of the first element
          status: "ONLINE"        // Add the new status property
      };
      }
      
    },
    chatDeactive : (state, action) => {
      state.chatsList = state.chatsList.map((chat)=>{
        if (chat.members._id === action.payload._id) {
          
          return {...chat, members: {
            ...chat.members, // Spread the existing members object
            status: "OFFLINE", // Override the status property
          }}
        }
        return chat;
      })

      if (state.chatDetail !== null) {   
        state.chatDetail[0] = {
          ...state.chatDetail[0], // Spread the existing properties of the first element
          status: "OFFLINE"        // Add the new status property
      };
      }
    },

    messagesReaded: (state, action) => {
      const chatID = action.payload;

      // Update state
      state.chatsList = state.chatsList.map((chat) => {
        if (chat._id === chatID) {
          return { ...chat, newMessageCount: 0 }; // Reset newMessageCount to 0
        }
        return chat;
      });

      // Update localStorage
      const localData = localStorage.getItem('chatData');
      let storedChatData = localData ? JSON.parse(localData) : [];

      // Find the chat in localStorage and reset its newMessageCount to 0
      const chatIndex = storedChatData.findIndex(item => item.chatID === chatID);
      if (chatIndex !== -1) {
        storedChatData[chatIndex].newMessageCount = 0;
      }

      // Save updated data back to localStorage
      localStorage.setItem('chatData', JSON.stringify(storedChatData));
      
    },


    removeChatsList: (state) => {
      state.chatsList = [];
    },
    addChatDetail: (state, action) => {
      state.chatDetail = action.payload;
    },
    addChatDetail: (state, action) => { 
      state.chatDetail = action.payload;
    },
    removeChatDetail: (state) => {
      state.chatDetail = null;
    }
  }
});

export const { addChatsList, removeChatsList, addChatDetail, removeChatDetail, addMessageCountAndAleartFromLocal, addMessageCountAndNewMessage, messagesReaded , messageSenderChatTop, chatDeactive, chatActive} = chatReducer.actions;
export default chatReducer.reducer;
