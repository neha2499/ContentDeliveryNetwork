'use strict'

let fs = require('fs');
let cacheController = require('../controllers/cache.controller');
let request = require('request');
let path = require('path');
let idGenerator = require('./idGenerator');
let findLocation = require('./findLocation');
let s3fs = require('s3fs');
let awsConfig = require('../config/aws');
let execSync = require("child_process").execSync;
let edgeServers = require('../config/edgeServers');
let AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: '*********', secretAccessKey: '************************'
  });


// This function downloads the data to any of the edge server if requested content is not present in that
let download = function(uri, filename, s3fsVar, req, response, data, bucket){
    request.head(uri, function(err, res, body){
      if(res && res.headers){
        console.log(`content-type: ${res.headers['content-type']}`);
        console.log(`content-length: ${res.headers['content-length']}`);  
      }
      let write = s3fsVar.createWriteStream(filename);
      request(uri).pipe(write);
      write.on('finish', async () => {
        await cacheController.updateCache(req, data);
        let read = s3fsVar.createReadStream(filename);
        read.pipe(response);    
      });
    });
  };
  

// This function pulls the content from edge server and sends it back to the client
exports.pull = (req, res, next) => {
    let folder;
    let type = req.locals.contentType;
    if(type === 'img'){
        folder = 'img';
    }
    else if(type === 'video'){
        folder = 'video';
    }
    else if(type === 'js'){
        folder = 'js';
    }
    else if(type === 'css'){
        folder = 'css';
    }

    let e = findLocation.getEdgeServerName(req.locals.edgeServers[0]);
    let es3 = findLocation.getEdgeServerS3Name(req.locals.edgeServers[0]);
    let esBucket = findLocation.getEdgeServerBucket(req.locals.edgeServers[0]);
    let region = findLocation.getEdgeServerRegion(req.locals.edgeServers[0]);
    let city = findLocation.getEdgeServerCity(req.locals.edgeServers[0]);
    awsConfig['region'] = region;
    let s3fsVar = new s3fs(esBucket, awsConfig);
    if(!req.locals.expired){
        console.log(`Serving ${req.locals.content['fileName']} from edge server ${e} ${city}`);
        console.log('\n')
        folder = folder + '/' + req.locals.content['_id'] + '-' + req.locals.content['website'] + '-' + req.locals.content['fileName'];
        let read = s3fsVar.createReadStream(folder);
        read.pipe(res);
    }
    else{
        console.log(`Pushing ${req.params.fileName} to edge server ${e} ${city} from website server`);
        console.log('\n')
        let data = {};
        if(req.locals.content){
            folder = folder + '/' + req.locals.content['_id'] + '-' + req.params.website + '-' + req.params.fileName;
            data['createdAt'] = new Date();
            data['updatedAt'] = new Date();
            data[e] = true;
        }
        else{
            let id = idGenerator.generate();
            folder = folder + '/' + id + '-' + req.params.website + '-' + req.params.fileName;
            data = {_id: id, website: req.params.website, fileName: req.params.fileName, createdAt: new Date()};
            data[e] = true;
            if(req.params.pathName && req.params.pathName !== ''){
                data['path'] = req.params.pathName;
            }
        }
        download(req.locals.url, folder, s3fsVar, req, res, data, esBucket);
    }
    
}

exports.deleteFiles = async (req, res) => {
    for(let e of edgeServers){
        console.log(`Edge Server ${JSON.stringify(e)}`);
        const S3 = new AWS.S3({signatureVersion: 'v4', region: findLocation.getEdgeServerRegion({e: Object.keys(e)[0]})});
        const bucket = findLocation.getEdgeServerBucket({e: Object.keys(e)[0]});
        S3.listObjects({Bucket: bucket}, function (err, data) {
            if (err) {
                console.log("error listing bucket objects "+err);
                return;
            }
            let items = data.Contents;
            for (let i = 0; i < items.length; i += 1) {
                let deleteParams = {Bucket: bucket, Key: items[i].Key};
                S3.deleteObject(deleteParams, function (err, data) {
                    if (err) {
                        console.log("delete err " + deleteParams.Key);
                        console.log(`Error ${JSON.stringify(err)}`)
                    } else {
                        console.log("deleted " + deleteParams.Key);
                    }
                });
            }
        });
    }
    res.status(200).jsonp({message: 'Deletd all the saved data successfully', status: 'success'});
}
