import {Box, Button, Stack, Typography, useTheme} from '@mui/material';
import {isEmpty, size} from 'lodash';
import React, {FormEvent, useState} from 'react';
import {createUseStyles} from 'react-jss';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch} from '../../../contexts/shopping-list-context';
import ShoppingListServices from '../../../services/shopping-list-services';
import {useDisconnectionHandler} from '../../../utils/use-disconnection-handler';
import CommonFormElements from './common-form-elements';

const useStyles = createUseStyles({
	'add-item-form': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 0 auto',
	},
	'add-item-form-stack': {
		padding: '2.8rem 2.6rem 2.1rem 3rem',
		height: '100%',
	},
});

export const AddItemForm = () => {
	const dispatch = useShoppingListDispatch();
	const postNewShoppingListItem = ShoppingListServices.usePostNewShoppingListItemService(dispatch);
	const disconnectionHandler = useDisconnectionHandler(dispatch);

	const navigate = useNavigate();
	const {spacing} = useTheme();
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [quantity, setQuantity] = useState<string>('');

	const [nameValid, setNameValidation] = useState(true);
	const [descriptionValid, setDescriptionValidation] = useState(true);
	const [quantityValid, setQuantityValidation] = useState(true);

	const handleSetDescription = (value: string) => {
		if (size(value) > 100) {
			setDescriptionValidation(false);
		} else {
			setDescriptionValidation(true);
		}

		setDescription(value);
	};

	const handleAdd = (event: FormEvent) => {
		event.preventDefault();

		let valid = true;
		if (isEmpty(name) || size(name) > 100) {
			setNameValidation(false);
			valid = false;
		}

		if (size(description) > 100) {
			setDescriptionValidation(false);
			valid = false;
		}

		if (isEmpty(quantity)) {
			setQuantityValidation(false);
			valid = false;
		}

		if (!valid) {
			return;
		}

		disconnectionHandler(async () => postNewShoppingListItem({
			name,
			description,
			quantity: Number(quantity),
		}));

		navigate('/');
	};

	const classes = useStyles();
	return (
		<form className={classes['add-item-form']} onSubmit={handleAdd}>
			<Stack spacing={spacing()} className={classes['add-item-form-stack']}>
				<Box>
					<Typography variant="primary">Add an Item</Typography>
					<Typography variant="secondary">Add your new item below</Typography>
				</Box>
				<CommonFormElements
					name={name}
					nameValid={nameValid}
					description={description}
					descriptionValid={descriptionValid}
					quantity={quantity}
					quantityValid={quantityValid}
					setName={setName}
					setDescription={handleSetDescription}
					setQuantity={setQuantity}
				/>
				<Box flexGrow={1}/>
				<Stack
					direction="row"
					spacing={1}
					justifyContent="flex-end"
				>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							navigate('/');
						}}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						type="submit"
						onClick={handleAdd}
					>
						Add Task
					</Button>
				</Stack>
			</Stack>
		</form>
	);
};

export default AddItemForm;
