const { getUser, createUser, loginUser, logOut, searchUsers, sendRequest, acceptRequest, getAllRequests, getMyFriends } = require('../../controllers/user.controller');
const { registerValidator, validateHandle } = require('../../lib/validators');
const { isAuthenticated } = require('../../middlewares/auth'); 
const { singleAvatar } = require('../../middlewares/multer');  


const userRoutes = require('express').Router();  


userRoutes.post('/create', singleAvatar, registerValidator(), createUser);    //Means we are accesing only single files which name avatar 
userRoutes.post('/', loginUser);

userRoutes.use(isAuthenticated);  //can do this also so all the below routes will have this middleware by default
userRoutes.get('/get-user', getUser);
userRoutes.get('/logout', logOut);
userRoutes.get('/search-users', searchUsers);
userRoutes.put('/send-request', sendRequest);
userRoutes.put('/accept-request', acceptRequest);
userRoutes.get('/get-all-requests', getAllRequests);
userRoutes.get('/get-all-friends', getMyFriends);

module.exports = userRoutes; 