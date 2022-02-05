import {Checkbox, IconButton, Stack, Typography} from '@mui/material';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {ShoppingListItem} from '../../models/shopping-list-models';
import {Icon} from '../icon';

const listItemStyles = (purchased: boolean): React.CSSProperties => ({
	width: '100%',
	border: '0.05rem solid #D5DFE9',
	borderRadius: '4px',
	background: purchased
		? 'rgba(213, 223, 233, 0.17)'
		: '',
});

export const ListItem = ({
	id,
	name,
	description,
	purchased,
	handleDelete,
	handlePurchasedToggle,
}: {
	handleDelete: () => void;
	handlePurchasedToggle: () => void;
} & ShoppingListItem) => {
	const navigate = useNavigate();
	return (
		<Stack
			pt={2.4} pr={2} pb={2}
			pl={2.1}
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
				}}
				>
					<Icon outlined name="edit"/>
				</IconButton>

				<IconButton
					onClick={handleDelete}
				>
					<Icon outlined name="delete"/>
				</IconButton>
			</Stack>
		</Stack>
	);
};

export default ListItem;
