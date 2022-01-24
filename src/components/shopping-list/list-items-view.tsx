import {Button} from '@mui/material';
import {map} from 'lodash';
import React from 'react';
import {useShoppingListDispatch} from '../../contexts/shopping-list-context';
import {ShoppingListItem, ShoppingListState} from '../../models/shopping-list-models';
import {useDeleteShoppingListItemService} from '../../services/shopping-list-services';
import {Icon} from '../icon';

function ListItem({
	id,
	name,
	description,
}: ShoppingListItem) {
	const dispatch = useShoppingListDispatch();
	const deleteShoppingListItem = useDeleteShoppingListItemService(dispatch);
	const handleDelete = (id: ShoppingListItem['id']) => () => {
		void deleteShoppingListItem(id);
	};

	return <div>
		<span>{name}</span>
		<span>{description}</span>
		<Button
			onClick={handleDelete(id)}
		>
			<Icon name="delete" />
		</Button>
	</div>;
}

export function ListItemsView({listItems}: Pick<ShoppingListState, 'listItems'>) {
	return <div>
		{map(listItems, item => <ListItem {...item} />)}
	</div>;
}

export default ListItemsView;
