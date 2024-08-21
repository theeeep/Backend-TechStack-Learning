// Using http server

import http from "node:http";
import WebSocket, { WebSocketServer } from "ws";

// http-server
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const server = http.createServer((request: any, response: any) => {
	console.log(`${new Date()} Received request for ${request.url}`);
	response.end("Hi there");
});

// web-socket server
const wss = new WebSocketServer({ server });

let userCount = 0;
wss.on("connection", function connection(socket) {
	socket.on("error", (err) => console.error(err));

	socket.on("message", function message(data, isBinary) {
		// biome-ignore lint/complexity/noForEach: <explanation>
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data, { binary: isBinary });
			}
		});
	});
	console.log(`User connected ${++userCount}`);
	socket.send("Hello! Message from Server!!");
});

server.listen(8080, () => {
	console.log(`${new Date()} Server is listening on Port 8080`);
});
