const spdy = require("spdy")
const express = require("express")
const fs = require("fs")
const path = require('path');
const request = require('request');
const axios = require('axios');
const app = express()


let cdn = 'https://localhost:3001';

app.use(express.static(path.join(__dirname, 'public')));
app.get("*", async (req, res) => {
    res.end(fs.readFileSync(__dirname + "/public/index.html"));
})

spdy.createServer(
  {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.crt")
  },
  app
).listen(3002, (err) => {
  if(err){
    throw new Error(err)
  }
  console.log("Wedding website Listening on port 3002")
})
