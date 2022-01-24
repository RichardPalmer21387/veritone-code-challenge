import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ErrorSnackbar} from './components/error-snackbar';
import Header from './components/header';
import ShoppingList from './components/shopping-list';
import SlideInView from './components/slide-in-view';
import AddItemForm from './components/slide-in-view/add-item-form.tsx';
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
	return <BrowserRouter>
		<div className="App" style={styles}>
			<Header />
			<ShoppingListProvider>
				<ShoppingList />
				<Routes>
					<Route path="/add-new-item" element={
						<SlideInView>
							<AddItemForm />
						</SlideInView>
					} />
				</Routes>
			</ShoppingListProvider>
			<ErrorSnackbar />
		</div>
	</BrowserRouter>;
}

export default App;
