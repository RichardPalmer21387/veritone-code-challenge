import {ThemeProvider} from '@mui/material';
import {isNil, isNumber} from 'lodash';
import React, {useEffect, useRef} from 'react';
import {matchPath, useLocation} from 'react-router-dom';
import jss from 'jss';
import preset from 'jss-preset-default';
import {createUseStyles} from 'react-jss';
import {ErrorSnackbar} from './components/error-snackbar';
import Header from './components/header';
import ShoppingList from './components/shopping-list';
import SlideInView from './components/slide-in-view';
import AddEditItemForm from './components/slide-in-view/add-edit-item-form';
import {AppActionTypes, useAppDispatch, useAppState} from './contexts/app-context';
import {useShoppingListDispatch} from './contexts/shopping-list-context';
import {useLoadShoppingListService} from './services/shopping-list-services-hooks/load-shopping-list-service';
import useMuiTheme from './use-mui-theme';
import {useIndexedDb} from './utils/use-indexeddb';

jss.setup(preset());

const useStyles = createUseStyles<'app'>({
	app: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'flex-start',
		width: '100%',
	},
});

export const App = () => {
	useIndexedDb();
	const appDispatch = useAppDispatch();
	const shoppingListDispatch = useShoppingListDispatch();
	const {inDisconnectedState} = useAppState();
	const loadShoppingList = useLoadShoppingListService(shoppingListDispatch);

	const location = useLocation();
	const addItemViewMatchPath = matchPath('/add-new-item', location.pathname);
	const editItemViewMatchPath = matchPath('/edit-list-item/:id', location.pathname);

	const reSyncIntervalRef = useRef<number | null>(null);
	useEffect(() => {
		if (inDisconnectedState) {
			if (isNil(reSyncIntervalRef.current)) {
				reSyncIntervalRef.current = window.setInterval(() => {
					void loadShoppingList().then(() => {
						appDispatch({
							type: AppActionTypes.SET_APP_IS_CONNECTED,
						});
					});
				}, 30_000);
			}
		} else if (isNumber(reSyncIntervalRef.current)) {
			window.clearInterval(reSyncIntervalRef.current);
			reSyncIntervalRef.current = null;
		}

		return () => {
			if (isNumber(reSyncIntervalRef.current)) {
				window.clearInterval(reSyncIntervalRef.current);
				reSyncIntervalRef.current = null;
			}
		};
	}, [inDisconnectedState, appDispatch, loadShoppingList]);

	const classes = useStyles();
	return (
		<div className={classes.app}>
			<ThemeProvider theme={useMuiTheme()}>
				<Header/>
				<ShoppingList/>
				<SlideInView open={!isNil(addItemViewMatchPath)}>
					<AddEditItemForm/>
				</SlideInView>
				<SlideInView open={!isNil(editItemViewMatchPath)}>
					<AddEditItemForm id={editItemViewMatchPath?.params.id}/>
				</SlideInView>
				<ErrorSnackbar/>
			</ThemeProvider>
		</div>
	);
};
