
const { newGroupChat, getMyChat, getMyGroup, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages, getChatDetailsEdit, changeGroupName, makeAdmin, removeAdmin } = require('../../controllers/chat.controller');
const { getMyFriends, getAllUser } = require('../../controllers/user.controller');
const { isAuthenticated } = require('../../middlewares/auth');
const { attachmentsMulter, singleAvatar } = require('../../middlewares/multer');



const chatRoutes = require('express').Router();



chatRoutes.use(isAuthenticated);  //can do this also so all the below routes will have this middleware by default

chatRoutes.post('/new-group',singleAvatar ,newGroupChat);
chatRoutes.get('/get-my-chat', getMyChat);
chatRoutes.post('/make-admin', makeAdmin);
chatRoutes.post('/remove-admin', removeAdmin);
chatRoutes.get('/get-my-group', getMyGroup);      //Admin of groups
chatRoutes.get('/get-my-memberNotInGroup', getMyFriends);      //Admin of groups
chatRoutes.put('/add-members', addMembers);  
chatRoutes.put('/remove-member', removeMember);  
chatRoutes.delete('/leave-group/:id', leaveGroup);  
chatRoutes.post('/message', attachmentsMulter, sendAttachments);  

// chatRoutes.get('/chat/:id', getAllChats);
// chatRoutes.post('/chat/:id', sendChat);
// chatRoutes.delete('/chat/:id', deleteChat);
chatRoutes.get('/message/:id', getMessages)

chatRoutes.get('/edit/:id' , getChatDetailsEdit)
chatRoutes.put('/edit/:id' , changeGroupName)
chatRoutes.route('/:id').get(getChatDetails).put(renameGroup).delete(deleteChat);


module.exports = chatRoutes;