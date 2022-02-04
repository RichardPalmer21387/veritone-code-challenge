import {Box, Button, Checkbox, IconButton, Stack, Typography} from '@mui/material';
import {map, noop, reject} from 'lodash';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch} from '../../contexts/shopping-list-context';
import {ShoppingListItem, ShoppingListState} from '../../models/shopping-list-models';
import {usePutShoppingListItemService} from '../../services/shopping-list-services';
import {Icon} from '../icon';
import {ConfirmDeleteModal} from './confirm-delete-modal';

const listItemStyles = (purchased: boolean): React.CSSProperties => ({
	width: '100%',
	border: '0.05rem solid #D5DFE9',
	borderRadius: '4px',
	background: purchased
		? 'rgba(213, 223, 233, 0.17)'
		: '',
});

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
	const navigate = useNavigate();
	return <Stack
		pt={2.4} pr={2} pb={2} pl={2.1}
		boxSizing="border-box"
		style={listItemStyles(purchased)}
		direction="row"
		alignItems="center"
		justifyContent="space-between"
	>
		<Stack direction="row" alignItems="center">
			<Checkbox
				checked={purchased}
				onChange={handlePurchasedToggle}
			/>
			<Stack>
				<Typography variant="itemTitle">{name}</Typography>
				<Typography variant="itemDescription">{description}</Typography>
			</Stack>
		</Stack>
		<Stack direction="row">
			<IconButton onClick={() => {
				navigate(`/edit-list-item/${id}`);
			}}>
				<Icon name="edit" outlined />
			</IconButton>

			<IconButton
				onClick={handleDelete}
			>
				<Icon name="delete" outlined />
			</IconButton>
		</Stack>
	</Stack>;
}

const listStyles: React.CSSProperties = {
	width: '90vw',
	maxWidth: '102.5rem',
};

export function ListItemsView({listItems}: Pick<ShoppingListState, 'listItems'>) {
	const dispatch = useShoppingListDispatch();
	const putShoppingListItem = usePutShoppingListItemService(dispatch);
	const navigate = useNavigate();
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

	return <Box style={listStyles} my={2} pt={3}>
		<Stack justifyContent="flex-start" spacing={2}>
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
			>
				<Typography variant="semibold">Your Items</Typography>
				<Button onClick={() => {
					navigate('/add-new-item');
				}}>Add Item</Button>
			</Stack>
			{map(
				reject(listItems, 'deleted'),
				item => <ListItem
					key={item.id}
					{...item}
					handlePurchasedToggle={handlePurchasedToggle(item)}
					handleDelete={openDeleteModal(item)}
				/>,
			)}
			<Box p={1}></Box>
		</Stack>
		<ConfirmDeleteModal open={modalOpen} closeModal={closeModal} confirmDelete={toDeleteItem ? handleDelete(toDeleteItem) : noop} />
	</Box>;
}

export default ListItemsView;
