import {Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, useTheme} from '@mui/material';
import {find, isEmpty, isNil} from 'lodash';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch, useShoppingListState} from '../../../contexts/shopping-list-context';
import {ShoppingListItem} from '../../../models/shopping-list-models';
import {usePutShoppingListItemService, usePostNewShoppingListItemService} from '../../../services/shopping-list-services';

function CommonFormElements({
	name,
	nameValid,
	description,
	descriptionValid,
	quantity,
	quantityValid,
	setName,
	setDescription,
	setQuantity,
}: {
	name: string;
	nameValid: boolean;
	description: string;
	descriptionValid: boolean;
	quantity: string;
	quantityValid: boolean;
	setName: React.Dispatch<React.SetStateAction<string>>;
	setDescription: React.Dispatch<React.SetStateAction<string>>;
	setQuantity: React.Dispatch<React.SetStateAction<string>>;
}) {
	return <>
		<Grid item xs={12}>
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
		</Grid>
		<Grid item xs={12}>
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
		</Grid>
		<Grid item xs={12}>
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
		</Grid>
	</>;
}

function AddItemForm() {
	const dispatch = useShoppingListDispatch();
	const postNewShoppingListItem = usePostNewShoppingListItemService(dispatch);

	const navigate = useNavigate();
	const {spacing} = useTheme();
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

		void postNewShoppingListItem({
			name,
			description,
			quantity: Number(quantity),
		});
	};

	return <Grid container spacing={spacing()}>
		<CommonFormElements
			name={name}
			nameValid={nameValid}
			description={description}
			descriptionValid={descriptionValid}
			quantity={quantity}
			quantityValid={quantityValid}
			setName={setName}
			setDescription={setDescription}
			setQuantity={setQuantity}
		/>
		<Grid item xs={12}>
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
		</Grid>
	</Grid>;
}

function EditItemForm({
	item,
}: {
	item: ShoppingListItem;
}) {
	const dispatch = useShoppingListDispatch();
	const putShoppingListItem = usePutShoppingListItemService(dispatch);

	const navigate = useNavigate();
	const {spacing} = useTheme();
	const [name, setName] = useState<string>(item.name);
	const [description, setDescription] = useState<string>(item.description);
	const [quantity, setQuantity] = useState<string>(item.quantity.toString());
	const [purchased, setPurchased] = useState<boolean>(item.purchased);

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

		void putShoppingListItem({
			...item,
			name,
			description,
			quantity: Number(quantity),
			purchased,
		});
	};

	return <Grid container spacing={spacing()}>
		<CommonFormElements
			name={name}
			nameValid={nameValid}
			description={description}
			descriptionValid={descriptionValid}
			quantity={quantity}
			quantityValid={quantityValid}
			setName={setName}
			setDescription={setDescription}
			setQuantity={setQuantity}
		/>
		<Grid item xs={12}>
			<FormControl
				fullWidth
			>
				<FormControlLabel
					label="Purchased"
					control={
						<Checkbox
							checked={purchased}
							onChange={() => {
								setPurchased(!purchased);
							}}
						/>
					}
				/>
			</FormControl>
		</Grid>
		<Grid item xs={12}>
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
				Save Item
			</Button>
		</Grid>
	</Grid>;
}

export function AddEditItemForm({
	id,
}: {
	id?: string;
}) {
	const shoppingListState = useShoppingListState();

	if (id) {
		const itemToEdit = find(
			shoppingListState.listItems,
			item => item.id.toString() === id,
		);
		if (isNil(itemToEdit)) {
			return <>No shopping list item with ID found!</>;
		}

		return <EditItemForm item={itemToEdit} />;
	}

	return <AddItemForm />;
}

export default AddEditItemForm;
