'use strict';

let crypto = require('crypto');

// This function creates hash that is used as contentId
exports.generate = () => {
    let currentDate = new Date().valueOf().toString();
    let random = Math.random().toString();
    let id = crypto
      .createHash('sha1')
      .update(currentDate + random)
      .digest('hex');
    return id;
};    