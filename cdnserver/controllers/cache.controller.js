'use strict';

let Cache = require('../models/cache.model');
let checkExpire = require('../helpers/checkExpire');
let fs = require('fs');

// This function finds the requested data in database
exports.findData = (req, res, next) => {
    Cache.findOne({website: req.params.website, path: req.params.pathName, fileName: req.params.fileName}, (err, data) => {
        if(err){
            console.log(`Error occurred while finding content ${err}`);
            res.redirect(req.locals.url);
        }
        else if(data){
            req.locals.content = data;
        }
        else{
            req.locals.content = null;
        }   
        next();
    });
}

// This function updates the requested content in database
exports.updateCache = (req, data) => {
    return new Promise((resolve, reject) => {
        Cache.findOneAndUpdate({website: req.params.website, path: req.params.pathName, fileName: req.params.fileName}, data, {upsert: true}, (err, result) => {
            if(err){
                console.log(`Error occurred while updating cache content ${err}`);
                resolve();
            }
            else{
                resolve();
            }
        });    
    });
}

exports.purge = (req, res, next) => {
    Cache.deleteMany({}, (err, data) => {
        if(err){
            console.log(`Error occurred while deleting all the saved data ${err}`);
            res.status(500).jsonp({message: 'Error occurred while deleting all the saved data', status: 'fail'});
        }
        else{
            console.log('Deleted all the saved data successfully');
            next();
        }
    });
}