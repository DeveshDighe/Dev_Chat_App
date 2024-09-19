
const { newGroupChat, getMyChat, getMyGroup, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteChat, getMessages } = require('../../controllers/chat.controller');
const { isAuthenticated } = require('../../middlewares/auth');
const { attachmentsMulter } = require('../../middlewares/multer');



const chatRoutes = require('express').Router();



chatRoutes.use(isAuthenticated);  //can do this also so all the below routes will have this middleware by default

chatRoutes.post('/new-group', newGroupChat);
chatRoutes.get('/get-my-chat', getMyChat);
chatRoutes.get('/get-my-group', getMyGroup);      //Admin of groups
chatRoutes.put('/add-members', addMembers);  
chatRoutes.put('/remove-member', removeMember);  
chatRoutes.delete('/leave-group/:id', leaveGroup);  
chatRoutes.post('/message', attachmentsMulter, sendAttachments);  

// chatRoutes.get('/chat/:id', getAllChats);
// chatRoutes.post('/chat/:id', sendChat);
// chatRoutes.delete('/chat/:id', deleteChat);
chatRoutes.get('/message/:id', getMessages)

chatRoutes.route('/:id').get(getChatDetails).put(renameGroup).delete(deleteChat);


module.exports = chatRoutes;