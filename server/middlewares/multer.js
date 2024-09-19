const multer = require('multer');


const multerUpload = multer({
  limits : {
  fileSize : 1024 * 1034 * 5,
}
})


const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array('files', 5); //max 5 files


module.exports = {
  multerUpload,
  singleAvatar,
  attachmentsMulter
}