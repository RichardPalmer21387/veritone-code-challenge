import {Typography} from '@mui/material';
import React from 'react';

export const headerStyles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	alignItems: 'center',
	backgroundColor: '#4D81B7',
	boxSizing: 'border-box',
	color: 'white',
	display: 'flex',
	height: '64px',
	minHeight: '64px', // Fix for height scaling with vh in firefox.
	paddingLeft: '30px',
	width: '100%',
};

export function Header() {
	return <header style={headerStyles} className="App-header">
		<Typography variant="h1">Shopping List</Typography>
	</header>;
}

export default Header;
