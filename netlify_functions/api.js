// 'use strict';
// const express = require('express');
// const serverless = require('serverless-http');
// const app = express();
// //const bodyParser = require('body-parser');

// const func = 'api'; // file name

// //function updateDatabase(data) {
// //  return { message: "hi, i am function in netlify_functions" };
// //}

// //app.use(bodyParser);
// app.post(`/${func}/updatestate`, (req, res) => {
//   //const newValue = updateDatabase(res.body);
//   res.json({ message: "hi, update state" });
// });

// app.get(`/${func}/hi`, (req, res) => {
//   //const newValue = updateDatabase(res.body);
//   res.json({
//     message: 'hi'
//   });
// });

// app.get(`/${func}/api2`, (req, res) => {
//   //const newValue = updateDatabase(res.body);
//   res.json({
//     message: [
//       req.url,
//       Object.keys(req),
//       req.method,
//       req.body,
//       req.params,
//       req.query,
//       req.route,
//       Object.keys(req.res),
//       process.env,
//     ]
//   });
// });

// app.get(`/${func}/*`, (req, res) => {
//   res.json({
//     message: "none of find"
//   });
// });

const serverless = require('serverless-http');
const app = require("../index.js");
module.exports.handler = serverless(app);
