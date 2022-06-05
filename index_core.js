const express = require("express")
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
dotenv.config();
const multer = require("multer");
const path = require("path");
const dataRoute = require("./routes_curd");
const fileRoute = require("./routes_upload");
const compression = require("compression");

const app = express();
const shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
        // Will not compress responses, if this header is present
        return false;
    }
    // Resort to standard compression
    return compression.filter(req, res);
};

// Compress all HTTP responses
app.use(compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
    // threshold: It is the byte threshold for the response 
    // body size before considering compression, the default is 1 kB
    threshold: 0
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use("/api/mydata", dataRoute);
app.use("/api/images", fileRoute);

app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(express.static(path.join(__dirname, "/client/build")));

app.get(`/api/*`, (req, res) => {
    res.json({
        message: "no route for req.path"
    });
});

// set client router response
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

module.exports = app;
