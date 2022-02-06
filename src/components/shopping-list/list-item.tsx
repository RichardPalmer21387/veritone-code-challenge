import {Checkbox, IconButton, Stack, Typography} from '@mui/material';
import React from 'react';
import {createUseStyles} from 'react-jss';
import {useNavigate} from 'react-router-dom';
import classnames from 'classnames';
import {ShoppingListItem} from '../../models/shopping-list-models';
import {Icon} from '../icon';

const useStyles = createUseStyles({
	'list-item': {
		width: '100%',
		border: '0.05rem solid #D5DFE9',
		borderRadius: '4px',
	},
	purchased: {
		background: 'rgba(213, 223, 233, 0.17)',
		'& $list-item-name': {
			color: '#4D81B7',
			textDecoration: 'line-through',
		},
		'& $list-item-description': {
			textDecoration: 'line-through',
		},
	},
	'list-item-name': {},
	'list-item-description': {},
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
	const classes = useStyles();
	return (
		<Stack
			pt={2.4} pr={2} pb={2}
			pl={2.1}
			boxSizing="border-box"
			className={classnames(
				classes['list-item'],
				{[classes.purchased]: purchased},
			)}
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
					<Typography className={classes['list-item-name']} variant="itemTitle">{name}</Typography>
					<Typography className={classes['list-item-description']} variant="itemDescription">{description}</Typography>
				</Stack>
			</Stack>
			<Stack direction="row" spacing={1}>
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
