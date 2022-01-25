import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {isEmpty, isNil} from 'lodash';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch} from '../../../contexts/shopping-list-context';
import {usePutNewShoppingListItemService} from '../../../services/shopping-list-services';

export function AddItemForm() {
	const dispatch = useShoppingListDispatch();
	const putNewShoppingListItem = usePutNewShoppingListItemService(dispatch);

	const navigate = useNavigate();
	const [name, setName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [quantity, setQuantity] = useState<string>('');

	const [nameValid, setNameValidation] = useState(true);
	const [descriptionValid, setDescriptionValidation] = useState(true);
	const [quantityValid, setQuantityValidation] = useState(true);

	const handleAdd = () => {
		let valid = true;
		if (isEmpty(name)) {
			setNameValidation(false);
			valid = false;
		}

		if (isEmpty(description)) {
			setDescriptionValidation(false);
			valid = false;
		}

		if (isNil(quantity)) {
			setQuantityValidation(false);
			valid = false;
		}

		if (!valid) {
			return;
		}

		void putNewShoppingListItem({
			name,
			description,
			quantity: Number(quantity),
		});
	};

	return <>
		<FormControl fullWidth>
			<TextField
				id="name"
				label="Name"
				variant="outlined"
				value={name}
				color={nameValid ? 'primary' : 'error'}
				onChange={event => {
					setName(event.target.value);
				}}
			/>
		</FormControl>
		<FormControl fullWidth>
			<TextField
				id="description"
				label="Description"
				multiline
				variant="outlined"
				value={description}
				color={descriptionValid ? 'primary' : 'error'}
				onChange={event => {
					setDescription(event.target.value);
				}}
			/>
		</FormControl>
		<FormControl fullWidth>
			<InputLabel id="quantity-label">How many?</InputLabel>
			<Select
				labelId="quantity-label"
				id="quantity"
				label="How many?"
				placeholder="How many?"
				value={quantity}
				color={quantityValid ? 'primary' : 'error'}
				onChange={event => {
					setQuantity(event.target.value);
				}}
			>
				<MenuItem value={1}>1</MenuItem>
				<MenuItem value={2}>2</MenuItem>
				<MenuItem value={3}>3</MenuItem>
			</Select>
		</FormControl>
		<Button
			onClick={() => {
				navigate('/');
			}}
			color="secondary"
		>
			Cancel
		</Button>
		<Button
			onClick={handleAdd}
		>
			Add Task
		</Button>
	</>;
}

export default AddItemForm;
