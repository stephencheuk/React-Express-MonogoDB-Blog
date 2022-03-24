const express = require("express")
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const path = require("path");
const dataRoute = require("./routes_curd");
const fileRoute = require("./routes_upload.js");

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });

app.use("/api/mydata", dataRoute);

app.use("/api/images", fileRoute);

app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log("Server ready and Listen on " + (process.env.PORT || 5000)))
