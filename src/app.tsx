import React from 'react';
import {ErrorSnackbar} from './components/error-snackbar';
import Header from './components/header';
import ShoppingList from './components/shopping-list';
import {ShoppingListProvider} from './contexts/shopping-list-context';
import {useIndexedDb} from './utils/use-indexeddb';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	justifyContent: 'flex-start',
	width: '100%',
};

export function App() {
	useIndexedDb();
	return <div className="App" style={styles}>
		<Header />
		<ShoppingListProvider>
			<ShoppingList />
		</ShoppingListProvider>
		<ErrorSnackbar />
	</div>;
}

export default App;
