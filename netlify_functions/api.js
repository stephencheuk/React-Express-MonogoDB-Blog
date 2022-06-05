const serverless = require('serverless-http');
const app = require("../index_core.js");
module.exports.handler = serverless(app);
