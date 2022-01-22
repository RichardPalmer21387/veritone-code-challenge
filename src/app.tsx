import React from 'react';
import Header from './components/header';
import ShoppingList from './components/shopping-list';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	justifyContent: 'flex-start',
	width: '100%',
};

function App() {
	return (
		<div className="App" style={styles}>
			<Header />
			<ShoppingList />
		</div>
	);
}

export default App;
