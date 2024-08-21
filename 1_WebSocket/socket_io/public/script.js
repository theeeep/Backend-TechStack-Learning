// io() connects to the socket.io server at the url
const socket = io("http://localhost:4000");

/*
 Just like on our socket server, our socket / socket client has an:
   - on method 
   - an emit method 
*/

socket.on("welcome", (data) => {
	console.log(data);

	// once welcome is emitted from the server, we run this callback
	socket.emit("thankYou", [4, 5, 6]);
});
