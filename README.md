# ContentDeliveryNetwork

## Introduction
- The aim of our project is to design and implement a web application through which a user can
stream the videos from any of the desired locations
- In this project a CDN network of 1 Controller server and 5 Edge servers. 
- The controller server is situated in Canada and edge servers E1, E2, E3,
E4 and E5 are situated at Mumbai, London, São Paulo, N. Virginia and Oregon respectively.
- CDN is used as a middleware network of servers that handles the content delivery of a web
application, reducing the load on the main server and providing less load time of resources to
clients

## Design Goals
#### Prior the end user makes requests for the videos, Main servers should be permitted to push videos to a select set of replica servers. Using Modern application layer protocol HTTP/2
- To fulfill this design goal, the SPDY is used which is a node.js module that creates the server
to use HTTP/2 communication protocol. It improves web efficiency and streamlines HTTP
traffic. For a speedier user experience, the SPDY has the capability to alter the transferred
information and optimize bandwidth utilization. The functionality that server is permitted to
push videos to the edge cache is done securely by generating key and certificate using
readFileSync () function.

#### The controller should be able to select the specified replica server which will serve any given end-user request it (the controller) receives and have the ability to route end-user requests to the chosen replica server.
- The Geolib library is used to provide geospatial operation for calculating the distance of the
main server with the replicated server. In the project first the function is created to find the
array of the nearest server set. A function is used for sorting the array of the edge server based
on the distance. Further, the URL of the nearest edge server is returned in the code.

#### End-users should be able to request specific video and get the video streamed from the replica server selected by the controller.
- The function is created that downloads the data to any of the edge servers if the requested content
is not present in the same. Along with that the function pulls the content from the edge server and
sends it back to the client. The express node.js framework provide large variety of npm module
and packages which is relevance in relation to the demands of our project.

## Built With

- Node.js
- HTML, CSS, JavaScript
- AWS S3 bucket
- MongoDB
- Github Actions

## Getting Started
In order to run this web application the AWS S3 bucket need to be configured
- Start the application
   ```bash
  npm i
  npm start
   ```    
   ## Screenshots
   
   - Homepage along with protocols used

![App Screenshot](https://github.com/neha2499/ContentDeliveryNetwork/blob/master/cdn.png)

- Replica servers stored in AWS S3
![App Screenshot](https://github.com/neha2499/ContentDeliveryNetwork/blob/master/cdn.png)

