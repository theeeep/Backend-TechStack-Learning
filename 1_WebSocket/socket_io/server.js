const express = require("express");
const app = express();

app.use(express.static("public"));
const expressServer = app.listen(4000);

const socketio = require("socket.io");
// io is our socket.io server
const io = socketio(expressServer, {});

// on is a regular javascript/node event listener
// emit is the other BIG method
io.on("connect", (socket) => {
	console.log(socket.id, " has joined our server!");

	// 1st arg or emit is the event name
	socket.emit("welcome", [1, 2, 3]); // Push an event to the broweser / client

	socket.on("thankYou", (data) => {
		console.log("message from client", data);
	});
});
