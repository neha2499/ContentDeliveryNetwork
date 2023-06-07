"use strict";

let geoip = require("geoip-lite");
let geolib = require("geolib");
let servers = require("../config/edgeServers");

// This function returns the array of most nearby edge servers
exports.getEdgeServer = (req, res, next) => {
  let ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  ip = "174.95.185.53";
  console.log(`IP of client: ${ip}`);
  let ipCord = geoip.lookup(ip);
  if (ipCord) {
    ipCord = ipCord["ll"];
  } else {
    ipCord = [18.516726, 73.935242];
  }
  console.log(`Coordinates of client: ${ipCord}`);
  let es = findMinServer(ipCord);
  req.locals.edgeServers = es;
  console.log(
    `All nearest edge servers and their distance from client: ${JSON.stringify(
      req.locals.edgeServers
    )}`
  );
  next();
};

// This function finds the nearest edge servers
let findMinServer = (cord) => {
  let dList = [];
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];
    let e = Object.keys(server)[0];
    let coordinates = [
      { latitude: cord[0], longitude: cord[1] },
      {
        latitude: server["e" + (i + 1)][0],
        longitude: server["e" + (i + 1)][1],
      },
    ];
    let d = geolib.getPreciseDistance(coordinates[0], coordinates[1]);
    dList.push({ e: e, d: d });
  }
  dList.sort(compare);
  return dList;
};

// This function is used for sorting the array of edge servers based on their distance from Main Server
let compare = (a, b) => {
  if (a.d < b.d) {
    return -1;
  }
  if (a.d > b.d) {
    return 1;
  }
  return 0;
};

// This function returns the name of edge server
exports.getEdgeServerName = (es) => {
  if (es["e"] === "e1") {
    return "e1";
  } else if (es["e"] === "e2") {
    return "e2";
  } else if (es["e"] === "e3") {
    return "e3";
  } else if (es["e"] === "e4") {
    return "e4";
  } else if (es["e"] === "e5") {
    return "e5";
  }
};

// This function returns the S3 URL of edge server
exports.getEdgeServerS3Name = (es) => {
  let s3 = ".amazonaws.com";
  if (es["e"] === "e1") {
    return "https://cdnserver-e1-ap.s3.ap-south-1" + s3;
  } else if (es["e"] === "e2") {
    return "https://cdnserver-e2-eu.s3.eu-west-2" + s3;
  } else if (es["e"] === "e3") {
    return "https://cdnserver-e3-sa.s3-sa-east-1" + s3;
  } else if (es["e"] === "e4") {
    return "https://cdnserver-e4-us1.s3" + s3;
  } else if (es["e"] === "e5") {
    return "https://cdnserver-e4-us2.s3-us-west-2" + s3;
  }
};

// This function returns S3 bucket of edge server
exports.getEdgeServerBucket = (es) => {
  if (es["e"] === "e1") {
    return "cdnserver-e1-ap";
  } else if (es["e"] === "e2") {
    return "cdnserver-e2-eu";
  } else if (es["e"] === "e3") {
    return "cdnserver-e3-sa";
  } else if (es["e"] === "e4") {
    return "cdnserver-e4-us1";
  } else if (es["e"] === "e5") {
    return "cdnserver-e4-us2";
  }
};

// This functions returns edge server region
exports.getEdgeServerRegion = (es) => {
  if (es["e"] === "e1") {
    return "ap-south-1";
  } else if (es["e"] === "e2") {
    return "eu-west-2";
  } else if (es["e"] === "e3") {
    return "sa-east-1";
  } else if (es["e"] === "e4") {
    return "us-east-1";
  } else if (es["e"] === "e5") {
    return "us-west-2";
  }
};

exports.getEdgeServerCity = (es) => {
  if (es["e"] === "e1") {
    return "Asia Pacific (Mumbai)";
  } else if (es["e"] === "e2") {
    return "EU (London)";
  } else if (es["e"] === "e3") {
    return "South America (Sao Paulo)";
  } else if (es["e"] === "e4") {
    return "US East (N. Virginia)";
  } else if (es["e"] === "e5") {
    return "US West (Oregon)";
  }
};
