'use strict';

let _ = require('lodash');

// This function creates a random reqToken
let randomString = function(length) {
    let chars = '****************************';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

// This function sets one random token to every request
let reqToken = function(req, res, next) {
    req.locals = {};
    let token = randomString(32);
    res.set('reqToken', token);
    req.reqToken = token;
    next();
};

module.exports = reqToken;

