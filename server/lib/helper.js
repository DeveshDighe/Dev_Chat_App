// helper.js

const { getSocketID } = require('./socketManager'); // Import function

const getOtherMember = (members, userID) => {
  return members.find((member) => member._id.toString() !== userID.toString());
};

// const getSockets = (users) => {
//   return users.map(user => getSocketID(user.toString()));
// };

const getBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

module.exports = {
  getOtherMember,
  // getSockets,
  getBase64,
};
