// bring in dependencies
const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// import our helper functions
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

// setup port
const PORT = process.env.PORT || 5000;

// bring in the router
const router = require('./router');

// initialize express server
const app = express();

// setup socket.io
const server = http.createServer(app);
const io = socketio(server);

// manage the socket connection
io.on('connection', socket => {
	// setting up the response to the event we fired on the clientside using the exact
	// same event name and passing in a callback function to the `on` method
	socket.on('join', ({ name, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room });

		if (error) return callback(error);
	});

	socket.on('disconnect', () => {
		console.log('User has left');
	});
});

// use router as middleware
app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`));
