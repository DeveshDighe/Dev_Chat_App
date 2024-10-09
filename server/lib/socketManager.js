// socketManager.js

let userSocketIDs = new Map();

const getUserSocketIDs = () => userSocketIDs;

const addSocketID = (userID, socketID) => {
  userSocketIDs.set(userID, socketID);
  console.log(userSocketIDs , 'userSocketIDs');
  
};

const removeSocketID = (userID) => {
  userSocketIDs.delete(userID);
};

const getSocketID = (userIDs) => {

  const socketIDs = userIDs.map((userId)=> userSocketIDs.get(userId.toString()));
    
  return socketIDs;
}
const getSocketIDWithoutEmitter = (userIDs, userID) => {

  const socketIDs = userIDs.map((userId)=> 
    { 
      if (userId === userID) {
        return
      }
      return userSocketIDs.get(userId.toString())
    });
    
  return socketIDs;
}

module.exports = {
  getUserSocketIDs,
  addSocketID,
  removeSocketID,
  getSocketID,
  getSocketIDWithoutEmitter
};
 