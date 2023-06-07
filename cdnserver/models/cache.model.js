'use strict';

let db = require("mongoose");
let Schema = db.Schema;


// cacheModel that stores all the information about the content whether any content is present in any edge server or not
let cacheSchema = new Schema({
    _id: String,
    website: String,
    fileName: String,
    type: String,
    path: String,
    createdAt: {type: Date, default: new Date()},
    updatedAt: Date,
    e1: {type: Boolean, default: false},
    e2: {type: Boolean, default: false},
    e3: {type: Boolean, default: false},
    e4: {type: Boolean, default: false},
    e5: {type: Boolean, default: false}
});

let cache = db.model('cache', cacheSchema);
module.exports = cache;
