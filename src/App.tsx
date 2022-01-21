import React from 'react';
import Header from './components/header';

function App() {
	const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
		height: '100%',
	};

	return (
		<div className="App" style={styles}>
			<Header />
		</div>
	);
}

export default App;
