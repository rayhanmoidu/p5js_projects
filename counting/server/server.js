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

let prevIncrement_time = -1;
const incrementThreshold_ms = 100;
let curValue = 0;

// listen for new connections
io.on("connection", (socket) => {
  // log the id of each new client
  console.log(`👋 connect ${socket.id}`);

  socket.on("restart", () => {
    console.log("restarting");
    socket.broadcast.emit("restart2");
    socket.emit("restart2");
  })

  socket.on("increment", (newValue) => {
    let isValid = true;
    if (prevIncrement_time == -1) {
        prevIncrement_time = (new Date()).getTime();
    } else {
        let curIncrement_time = (new Date()).getTime();
        let diff = curIncrement_time - prevIncrement_time;

        if (diff < incrementThreshold_ms) {
            isValid = false;
        }
        prevIncrement_time = curIncrement_time;
    }

    if (isValid) {
        console.log(` ${socket.id} increment`);
        socket.broadcast.emit("increment2", newValue);
        socket.emit("increment2", newValue);
    } else {
        socket.broadcast.emit("gameover");
        socket.emit("gameover");
    }
  })

});

