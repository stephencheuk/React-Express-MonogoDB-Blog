// const router = require("express").Router();
// var multer = require('multer');
// var path = require('path')

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './images')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
//   }
// });

// var upload = multer({ storage: storage });

// router.post("/files", upload.single('file'), (req, res) => {
//   return res.status(200).send({
//     "status": "success",
//     "path": '/images/' + req.file.filename
//   });
// });

// router.get("/files", (req, res) => {
//   return res.status(200).send({ "message": 'hi' });
// });

// module.exports = router;

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploadCloud = multer({ storage });

// module.exports = uploadCloud;

router.post("/files", uploadCloud.single('file'), (req, res, next) => {

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  return res.status(200).send({
    "status": "success",
    "path": req.file.path
  });
});

module.exports = router;