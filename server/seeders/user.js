const User = require("../models/user");
const {faker, simpleFaker} = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const Chat = require("../models/chat");
const Message = require("../models/message");


const createUserMultiple = async (numUsers) => {
  try {
    const userPromise = [];

    const password = 'Password';
    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name : faker.person.fullName(),
        username : faker.internet.userName(),
        bio : faker.lorem.sentence(20),
        password : await bcrypt.hash(password, 10),
        avatar : {
          url : faker.image.avatar(),
          public_id : faker.system.fileName(),
        }
      })
      userPromise.push(tempUser);
    } 

    await Promise.all(userPromise);

    console.log('Users created : ', numUsers);
    process.exit(1);
    
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}



module.exports = {
  createUserMultiple,

}