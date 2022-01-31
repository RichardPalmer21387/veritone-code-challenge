import {Button, Checkbox} from '@mui/material';
import {map, noop, reject} from 'lodash';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useShoppingListDispatch} from '../../contexts/shopping-list-context';
import {ShoppingListItem, ShoppingListState} from '../../models/shopping-list-models';
import {usePutShoppingListItemService} from '../../services/shopping-list-services';
import {Icon} from '../icon';
import {ConfirmDeleteModal} from './confirm-delete-modal';

function ListItem({
	id,
	name,
	description,
	purchased,
	handleDelete,
	handlePurchasedToggle,
}: {
	handleDelete: () => void;
	handlePurchasedToggle: () => void;
} & ShoppingListItem) {
	return <div>
		<Checkbox
			checked={purchased}
			onChange={handlePurchasedToggle}
		/>
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
	const putShoppingListItem = usePutShoppingListItemService(dispatch);
	const handleDelete = (listItem: ShoppingListItem) => () => {
		setModalOpen(false);
		void putShoppingListItem({
			...listItem,
			deleted: true,
		});
	};

	const handlePurchasedToggle = (listItem: ShoppingListItem) => () => {
		void putShoppingListItem({
			...listItem,
			purchased: !listItem.purchased,
		});
	};

	const [modalOpen, setModalOpen] = useState(false);
	const [toDeleteItem, setToDeleteItem] = useState<ShoppingListItem | null>(null);
	const closeModal = () => {
		setModalOpen(false);
	};

	const openDeleteModal = (listItem: ShoppingListItem) => () => {
		setModalOpen(true);
		setToDeleteItem(listItem);
	};

	return <div>
		Your Items
		<Link to="/add-new-item">
			<Button>Add Item</Button>
		</Link>
		{map(
			reject(listItems, 'deleted'),
			item => <ListItem
				key={item.id}
				{...item}
				handlePurchasedToggle={handlePurchasedToggle(item)}
				handleDelete={openDeleteModal(item)}
			/>,
		)}
		<ConfirmDeleteModal open={modalOpen} closeModal={closeModal} confirmDelete={toDeleteItem ? handleDelete(toDeleteItem) : noop} />
	</div>;
}

export default ListItemsView;
