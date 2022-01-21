import React from 'react';
import Header from './components/header';

function App() {
	const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'flex-start',
		width: '100%',
	};

	return (
		<div className="App" style={styles}>
			<Header />
		</div>
	);
}

export default App;
