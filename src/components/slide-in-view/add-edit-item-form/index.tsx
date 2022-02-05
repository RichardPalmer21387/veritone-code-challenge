import React from 'react';
import {find, isNil} from 'lodash';
import {useShoppingListState} from '../../../contexts/shopping-list-context';
import AddItemForm from './add-item-form';
import EditItemForm from './edit-item-form';

export const AddEditItemForm = ({
	id,
}: {
	id?: string;
}) => {
	const shoppingListState = useShoppingListState();

	if (id) {
		const itemToEdit = find(
			shoppingListState.listItems,
			item => item.id.toString() === id,
		);
		if (isNil(itemToEdit)) {
			return <>No shopping list item with ID found!</>;
		}

		return <EditItemForm item={itemToEdit}/>;
	}

	return <AddItemForm/>;
};

export default AddEditItemForm;
