import {ThemeProvider} from '@mui/material';
import {isNil} from 'lodash';
import React from 'react';
import {matchPath, useLocation} from 'react-router-dom';
import {ErrorSnackbar} from './components/error-snackbar';
import Header from './components/header';
import ShoppingList from './components/shopping-list';
import SlideInView from './components/slide-in-view';
import AddEditItemForm from './components/slide-in-view/add-edit-item-form';
import {ShoppingListProvider} from './contexts/shopping-list-context';
import useMuiTheme from './use-mui-theme';
import {useIndexedDb} from './utils/use-indexeddb';

const styles: React.CSSProperties = {
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	justifyContent: 'flex-start',
	width: '100%',
};

export const App = () => {
	useIndexedDb();
	const location = useLocation();
	const addItemViewMatchPath = matchPath('/add-new-item', location.pathname);
	const editItemViewMatchPath = matchPath('/edit-list-item/:id', location.pathname);

	return (
		<div className="App" style={styles}>
			<ThemeProvider theme={useMuiTheme()}>
				<Header/>
				<ShoppingListProvider>
					<ShoppingList/>
					<SlideInView open={!isNil(addItemViewMatchPath)}>
						<AddEditItemForm/>
					</SlideInView>
					<SlideInView open={!isNil(editItemViewMatchPath)}>
						<AddEditItemForm id={editItemViewMatchPath?.params.id}/>
					</SlideInView>
				</ShoppingListProvider>
				<ErrorSnackbar/>
			</ThemeProvider>
		</div>
	);
};

export default App;
