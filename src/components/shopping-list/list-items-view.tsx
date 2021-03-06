import {Box, Button, Stack, Typography} from '@mui/material';
import {map, noop, reject} from 'lodash';
import React, {useState} from 'react';
import {createUseStyles} from 'react-jss';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch} from '../../contexts/shopping-list-context';
import {ShoppingListItem, ShoppingListState} from '../../models/shopping-list-models';
import ShoppingListServices from '../../services/shopping-list-services';
import {useDisconnectionHandler} from '../../utils/use-disconnection-handler';
import {ConfirmDeleteModal} from './confirm-delete-modal';
import ListItem from './list-item';

const useStyles = createUseStyles({
	'list-stles': {
		width: '90vw',
		maxWidth: '102.5rem',
	},
});

export const ListItemsView = ({listItems}: Pick<ShoppingListState, 'listItems'>) => {
	const dispatch = useShoppingListDispatch();
	const putShoppingListItem = ShoppingListServices.usePutShoppingListItemService(dispatch);
	const disconnectionHandler = useDisconnectionHandler(dispatch);
	const navigate = useNavigate();
	const handleDelete = (listItem: ShoppingListItem) => () => {
		setModalOpen(false);
		disconnectionHandler(async () => putShoppingListItem({
			...listItem,
			deleted: true,
		}));
	};

	const handlePurchasedToggle = (listItem: ShoppingListItem) => () => {
		disconnectionHandler(async () => putShoppingListItem({
			...listItem,
			purchased: !listItem.purchased,
		}));
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

	const classes = useStyles();
	return (
		<Box className={classes['list-stles']} my={2} pt={3}>
			<Stack justifyContent="flex-start" spacing={2}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					mb={-1}
				>
					<Typography variant="semibold">Your Items</Typography>
					<Button onClick={() => {
						navigate('/add-new-item');
					}}
					>Add Item
					</Button>
				</Stack>
				{map(
					reject(listItems, 'deleted'),
					item => (
						<ListItem
							key={item.id}
							{...item}
							handlePurchasedToggle={handlePurchasedToggle(item)}
							handleDelete={openDeleteModal(item)}
						/>
					),
				)}
				<Box p={1}/>
			</Stack>
			<ConfirmDeleteModal open={modalOpen} closeModal={closeModal} confirmDelete={toDeleteItem ? handleDelete(toDeleteItem) : noop}/>
		</Box>
	);
};

export default ListItemsView;
