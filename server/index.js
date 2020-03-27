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

		// sends a welcome message to the user
		socket.emit('message', {
			user: 'admin',
			text: `${user.name}, welcome to the ${user.room} room`
		});

		// sends a message to everyone (except the joining user)
		// to let them know who is joining the room
		socket.broadcast
			.to(user.room)
			.emit('message', { user: 'admin', text: `${user.name}, has joined!` });

		socket.join(user.room);

		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		});

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('message', { user: user.name, text: message });
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		});

		callback();
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('message', {
				user: 'admin',
				text: `${user.name} has left`
			});
		}
	});
});

// use router as middleware
app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`));
