'use strict';

let express = require('express');
let db = require('mongoose');
let bodyParser = require('body-parser');
let reqToken = require('./helpers/reqToken');
let path = require('path');
let dbPath = "mongodb://localhost/cdnserverdb";
let wesiteValidator = require('./helpers/websiteValidator');
let typeChecker = require('./helpers/typeChecker');
let cacheController = require('./controllers/cache.controller');
let checkExpire = require('./helpers/checkExpire');
let contentPuller = require('./helpers/contentPuller');
let findLocation = require('./helpers/findLocation');
let getUrl = require('./helpers/getUrl');
let fs = require('fs');
let util = require('util');
let url = require('url');
const spdy = require("spdy")


// Database connection
db.connect(dbPath,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// access.log contains all the logs
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags : 'w'});
let logStdout = process.stdout;
console.log = function(d) { //
    accessLogStream.write(util.format(d) + '\n');
    logStdout.write(util.format(d) + '\n');
};

// Initialisation of express server
let app = express();

app.use(reqToken);

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }));

// GET api for receiving content request
app.get('/', 
    getUrl.get,
    wesiteValidator.validate,
    typeChecker.check,
    findLocation.getEdgeServer,
    cacheController.findData,
    checkExpire.check,
    contentPuller.pull
);

app.get('/removefiles',
    (req, res, next) => {
        fs.unlinkSync(path.join(__dirname, 'access.log'));
        next();
    },
    cacheController.purge,
    contentPuller.deleteFiles
);

app.get('/showdata', 
    (req, res) => {
        let read = fs.createReadStream(path.join(__dirname, 'access.log'));
        read.pipe(res);
    }
);


spdy.createServer(
    {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.crt")
    },
    app
  ).listen(3000, (err) => {
    if(err){
      throw new Error(err)
    }
    console.log("CDN server running on port 3000")
  })
  