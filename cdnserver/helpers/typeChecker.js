'use strict';

let mime = require('mime');
let path = require('path');

// This function checks the content type of requested content
exports.check = (req, res, next) => {
    let ext = path.extname(req.params.fileName).split('.').pop();
    let contype = mime.getType(ext); 
    if(contype){
        if(contype.includes('img') || contype.includes('image')){
            req.locals.contentType = 'img';
        }
        else if(contype.includes('video') || contype.includes('media')){
            req.locals.contentType = 'video';
        }
        else if(contype.includes('javascript')){
            req.locals.contentType = 'js';
        }
        else if(contype.includes('css')){
            req.locals.contentType = 'css';
        }
        console.log(`File Name: ${req.params.fileName}`);
        console.log(`Type of content: ${contype}`);
        next();
    }
    else{
        console,log('Content Type is not valid redirecting to the main server');
        res.redirect(req.locals.url);
    }

}