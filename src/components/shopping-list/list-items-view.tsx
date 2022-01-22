import {map} from 'lodash';
import React from 'react';
import {ShoppingListState} from '../../models/shopping-list';

export function ListItemsView({listItems}: Pick<ShoppingListState, 'listItems'>) {
	return <div>
		{map(listItems, item => <div>{item.name}</div>)}
	</div>;
}

export default ListItemsView;
