import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/index';
import Input from '../Input/index';
import Messages from '../Messages/index';

import './Chat.css';
import TextContainer from '../TextContainer';

let socket;

const Chat = ({ location }) => {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [users, setUsers] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const ENDPOINT = 'https://mack-chat-application.herokuapp.com/';

	useEffect(() => {
		const { name, room } = queryString.parse(location.search);

		socket = io(ENDPOINT);

		setName(name);
		setRoom(room);

		// sends an event to everyone. pass an object with our name and room
		socket.emit('join', { name, room }, () => {});

		return () => {
			socket.emit('disconnect');

			socket.off();
		};
	}, [ENDPOINT, location.search]);

	useEffect(() => {
		socket.on('message', message => {
			setMessages([...messages, message]);
		});

		socket.on('roomData', ({ users }) => {
			setUsers(users);
		});
	}, [messages]);

	// create function for sending messages
	const sendMessage = event => {
		event.preventDefault();

		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''));
		}
	};

	return (
		<div className='outerContainer'>
			<div className='container'>
				<InfoBar room={room} />
				<Messages messages={messages} name={name} />
				<Input
					message={message}
					setMessage={setMessage}
					sendMessage={sendMessage}
				/>
			</div>
			<TextContainer users={users} />
		</div>
	);
};

export default Chat;
