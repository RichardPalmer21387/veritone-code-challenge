import {Button} from '@mui/material';
import {map, noop} from 'lodash';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useShoppingListDispatch} from '../../contexts/shopping-list-context';
import {ShoppingListItem, ShoppingListState} from '../../models/shopping-list-models';
import {useDeleteShoppingListItemService} from '../../services/shopping-list-services';
import {Icon} from '../icon';
import {ConfirmDeleteModal} from './confirm-delete-modal';

function ListItem({
	id,
	name,
	description,
	handleDelete,
}: {
	handleDelete: () => void;
} & ShoppingListItem) {
	return <div>
		<span>{name}</span>
		<span>{description}</span>
		<Link to={`/edit-list-item/${id}`}>
			<Button>
				<Icon name="edit" />
			</Button>
		</Link>
		<Button
			onClick={handleDelete}
		>
			<Icon name="delete" />
		</Button>
	</div>;
}

export function ListItemsView({listItems}: Pick<ShoppingListState, 'listItems'>) {
	const dispatch = useShoppingListDispatch();
	const deleteShoppingListItem = useDeleteShoppingListItemService(dispatch);
	const handleDelete = (id: ShoppingListItem['id']) => () => {
		void deleteShoppingListItem(id);
	};

	const [modalOpen, setModalOpen] = useState(false);
	const [toDeleteId, setToDeleteId] = useState<string | null>(null);
	const closeModal = () => {
		setModalOpen(false);
	};

	const openDeleteModal = (id: ShoppingListItem['id']) => () => {
		setModalOpen(true);
		setToDeleteId(id);
	};

	return <div>
		Your Items
		<Link to="/add-new-item">
			<Button>Add Item</Button>
		</Link>
		{map(listItems, item => <ListItem key={item.id} {...item} handleDelete={openDeleteModal(item.id)} />)}
		<ConfirmDeleteModal open={modalOpen} closeModal={closeModal} confirmDelete={toDeleteId ? handleDelete(toDeleteId) : noop} />
	</div>;
}

export default ListItemsView;
