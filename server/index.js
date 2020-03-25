// bring in dependencies
const express = require('express');
const socketio = require('socket.io');
const http = require('http');

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
	console.log('We have a new connection');

	socket.on('disconnect', () => {
		console.log('User has left');
	});
});

// use router as middleware
app.use(router);

server.listen(PORT, () => console.log(`server has started on port ${PORT}`));
