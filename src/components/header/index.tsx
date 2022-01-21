import React from 'react';

export function Header() {
	const headerStyles: React.HTMLAttributes<HTMLDivElement>['style'] = {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: '30px',
		width: '100%',
		height: '64px',
		boxSizing: 'border-box',
		backgroundColor: '#4D81B7',
		textTransform: 'uppercase',
		fontFamily: 'Dosis, san-serif',
		fontSize: '18px',
		fontStyle: 'normal',
		fontWeight: 600,
		letterSpacing: '0.25px',
		color: 'white',
	};

	return <header style={headerStyles} className="App-header">
		Shopping List
	</header>;
}

export default Header;
