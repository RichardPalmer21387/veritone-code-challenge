import {isEmpty, isNil, reject} from 'lodash';
import log from 'loglevel';
import React, {useEffect} from 'react';
import {createUseStyles} from 'react-jss';
import {useAppState} from '../../contexts/app-context';
import {useShoppingListDispatch, useShoppingListState} from '../../contexts/shopping-list-context';
import ShoppingListServices from '../../services/shopping-list-services';
import Spinner from '../spinner';
import AddFirstItemView from './add-first-item-view';
import ListItemsView from './list-items-view';

const useStyles = createUseStyles({
	'shopping-list': {
		display: 'flex',
		justifyContent: 'center',
		minHeight: 'calc(100vh - 64px)', // Holds content height open for spinner ect.
		width: '100%',
	},
});

export const ShoppingList = () => {
	const {localDB} = useAppState();
	const {isLoading, listItems} = useShoppingListState();
	const dispatch = useShoppingListDispatch();
	const loadShoppingListItems = ShoppingListServices.useLoadShoppingListService(dispatch);

	useEffect(() => {
		if (!isNil(localDB)) {
			loadShoppingListItems()
				.catch(error => {
					log.error('Failed loading shopping list items.', error);
				});
		}
	}, [localDB, loadShoppingListItems]);

	const classes = useStyles();
	return (
		<main className={classes['shopping-list']}>
			{
				isLoading
					? <Spinner/>
					: (isEmpty(reject(listItems, 'deleted'))
						? <AddFirstItemView/>
						: <ListItemsView listItems={listItems}/>)
			}
		</main>
	);
};

export default ShoppingList;
