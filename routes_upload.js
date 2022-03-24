const router = require("express").Router();
var multer = require('multer');
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var upload = multer({ storage: storage });

router.post("/files", upload.single('file'), (req, res) => {
  return res.status(200).send({
    "status": "success",
    "path": '/images/' + req.file.filename
  });
});

router.get("/files", (req, res) => {
  return res.status(200).send({ "message": 'hi' });
});

module.exports = router;