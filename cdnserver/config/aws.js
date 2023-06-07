'use strict';

// AWS configuration
let awsConfig = {
    "accessKeyId" :"**********",
    "secretAccessKey" : "************",
    "region" : "*****",
    'maxRetries': 5,
    "httpOptions": {
        'timeout': 360000
    }
};

module.exports = awsConfig;