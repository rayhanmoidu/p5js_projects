// imports for webserver
const express = require("express");

const { createServer } = require("node:http");

// create a webserver
const app = express();
// subfolder to serve web pages
app.use(express.static("public"));
const server = createServer(app);

// start the webserver on port 3000
server.listen(3000, () => {
  console.log("webserver started: http://localhost:3000");
});

// setup socket server
const { Server } = require("socket.io");
// start socket server on webserver
const io = new Server(server);
console.log(`socket server at ${io.path()}`);

// listen for new connections
io.on("connection", (socket) => {
    // log the id of each new client
    console.log(`👋 connect ${socket.id}`);

    // add listener for "mouse" data
    socket.on("mouse", (data) => {
        console.log(` ${socket.id} mouse`, data);
        // broadcast to other clients
        socket.broadcast.emit("mouse", data); 
    });

    socket.on("key", (data) => {
        console.log(` ${socket.id} key`, data);
        // broadcast to other clients
        socket.broadcast.emit("key", data); 
    });
});

  
