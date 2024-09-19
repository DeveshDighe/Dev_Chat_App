const { getAllUsers, allChats, allMessages, getDashboardStats, verifyAdmin } = require('../../controllers/admin.controller');
const { isAuthenticated } = require('../../middlewares/auth');

const adminRoutes = require('express').Router();

// adminRoutes.post('/verify');
adminRoutes.use(isAuthenticated);

adminRoutes.get('/', verifyAdmin);
adminRoutes.get('/users', getAllUsers);
adminRoutes.get('/chats', allChats);
adminRoutes.get('/messages', allMessages);
adminRoutes.get('/stats', getDashboardStats);

module.exports = adminRoutes; 
