const allRoutes = require('express').Router();
const adminRoutes = require('./adminRoutes/admin.routes');
const chatRoutes = require('./chatRoutes/chat.routes');
const userRoutes = require('./userRoutes/user.routes')
 
allRoutes.use('/user', userRoutes);
allRoutes.use('/chat', chatRoutes);
allRoutes.use('/admin', adminRoutes);


module.exports = allRoutes; 