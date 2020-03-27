import React from 'react';
import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
	<div className='textContainer'>
		{users ? (
			<div>
				<h3>Active Users</h3>
				<div className='activeContainer'>
					<h4>
						{users.map(({ name }) => (
							<div key={name} className='activeItem'>
								{name}
								<img alt='Online icon' src={onlineIcon} />
							</div>
						))}
					</h4>
				</div>
			</div>
		) : null}
		<div>
			<h4>Built using React, Socket.io, and Node</h4>
		</div>
	</div>
);

export default TextContainer;
