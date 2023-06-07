'use strict'

// This function returns the original URL of requested content
exports.get = (req, res, next) => {
    let query = req.query;
    req.params.website = query['website'];
    req.params.fileName = query['fileName'];
    req.params.website = req.params.website.replace(/http:\/\/|https:\/\/|www\./,'');
    req.params.website = req.params.website.replace(/www\./,'');
    if(query['pathName'] && query['pathName'] !== ''){
        req.params.pathName = query['pathName'];
        req.locals.url = req.query.website + '/' + req.params.pathName + '/' + req.params.fileName;
    }
    else{
        req.locals.url = req.query.website + '/' + req.params.fileName;
    }
    console.log(`Server URL of content: ${req.locals.url}`);
    next();
}