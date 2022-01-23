import {isEmpty} from 'lodash';
import React, {useEffect} from 'react';
import {useShoppingListDispatch, useShoppingListState} from '../../contexts/shopping-list-context';
import {useLoadShoppingListService} from '../../services/shopping-list-services';
import {headerStyles} from '../header';
import Spinner from '../spinner';
import AddFirstItemView from './add-first-item-view';
import ListItemsView from './list-items-view';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	display: 'flex',
	justifyContent: 'center',
	minHeight: `calc(100vh - ${headerStyles?.height ?? 0})`, // Holds content height open for spinner ect.
	width: '100%',
};

export function ShoppingList() {
	const {isLoading, listItems} = useShoppingListState();
	const dispatch = useShoppingListDispatch();
	const loadShoppingListItems = useLoadShoppingListService(dispatch);

	useEffect(() => {
		void loadShoppingListItems();
	}, []);

	return <main style={styles} className="shopping-list">
		{
			isLoading
				? <Spinner />
				: (isEmpty(listItems)
					? <AddFirstItemView />
					: <ListItemsView listItems={listItems} />)
		}
	</main>;
}

export default ShoppingList;
