'use strict';

let moment = require('moment');

// This function checks whether a content older than 7 days or not
exports.check = (req, res, next) => {
    let data = req.locals.content;
    if(data){
        let now = moment(new Date());
        let createdAt = moment(data['createdAt']);
        let duration = moment.duration(now.diff(createdAt)).asDays();
        if(duration > 7){
            req.locals.expired = true;
        }
        else{
            let es = req.locals.edgeServers[0];
            if(data[es['e']]){
                req.locals.expired = false;
            }
            else{
                req.locals.expired = true;
            }
        }    
    }
    else{
        req.locals.expired = true;
    }
    next();
}