'use strict';

let websites = require('../config/webistes'); 

// This function validates whether a website is added in CDN or not
exports.validate = (req, res, next) => {
    if(websites.includes(req.params.website)){
        console.log(`URL ${req.params.website} is a valid to use cdn`);
        next();
    }
    else{
        console.log(`URL ${req.params.website} is not a valid to use cdn`);
        res.redirect(req.locals.url);
    }
}