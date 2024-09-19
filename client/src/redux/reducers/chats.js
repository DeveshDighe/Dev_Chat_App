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
      console.log(action.payload, 'This is action payload');

      const { chatID, message, currentChatID } = action.payload;

      state.chatsList = state.chatsList.map(chat => {
        if (chat._id === chatID) {
          // If the user is viewing the current chat, only update the latestMessage
          console.log(chatID, 'chatID', currentChatID, 'CurrentChatID');

          if (chatID === currentChatID) {
            return {
              ...chat,
              latestMessage: message, // Replace the latest message with the new message
              // Do not increment newMessageCount
            };
          }

          // If it's a different chat, update latestMessage and increase newMessageCount
          else {
            if (currentChatID) {

              return {
                ...chat,
                latestMessage: message, // Replace the latest message with the new message
                newMessageCount: (chat.newMessageCount || 0) + 1 // Increase newMessageCount
              };

            }
          }

        }

        return chat; // If no match, return the chat as is
      });

      // Optionally update localStorage
      const localData = localStorage.getItem('chatData');
      let storedChatData = localData ? JSON.parse(localData) : [];

      const chatIndex = storedChatData.findIndex(item => item.chatID === chatID);
      if (chatIndex !== -1) {
        // Only update newMessageCount in localStorage if chatID !== currentChatID
        if (chatID !== currentChatID) {
          storedChatData[chatIndex].newMessageCount += 1;
        }
      } else {
        storedChatData.push({ chatID, newMessageCount: chatID === currentChatID ? 0 : 1 });
      }

      localStorage.setItem('chatData', JSON.stringify(storedChatData));
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
    removeChatDetail: (state) => {
      state.chatDetail = null;
    }
  }
});

export const { addChatsList, removeChatsList, addChatDetail, removeChatDetail, addMessageCountAndAleartFromLocal, addMessageCountAndNewMessage, messagesReaded } = chatReducer.actions;
export default chatReducer.reducer;
