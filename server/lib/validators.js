const {body, validationResult, check} = require('express-validator')

const registerValidator = () => [
  body("username", "Please Enter UserName").notEmpty(),
  body("name", "Please Enter Name").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
]

const validateHandle = (req, res, next) => {
 const errors = validationResult(req);

 

 if (errors.isEmpty()) {
  return next();
 }
 else{
  const errorMessages = errors.array().map((error) => error.msg).join(', ');
  res.status(500).json({status : 'error', message : errorMessages})
 }
}
module.exports = {
  registerValidator,
  validateHandle
}