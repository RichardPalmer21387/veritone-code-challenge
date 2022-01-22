import React from 'react';

export const headerStyles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	alignItems: 'center',
	backgroundColor: '#4D81B7',
	boxSizing: 'border-box',
	color: 'white',
	display: 'flex',
	fontFamily: 'Dosis, san-serif',
	fontSize: '18px',
	fontStyle: 'normal',
	fontWeight: 600,
	height: '64px',
	letterSpacing: '0.25px',
	paddingLeft: '30px',
	textTransform: 'uppercase',
	width: '100%',
};

export function Header() {
	return <header style={headerStyles} className="App-header">
		Shopping List
	</header>;
}

export default Header;
