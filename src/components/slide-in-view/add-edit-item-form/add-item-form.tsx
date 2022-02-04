import {Button, Grid, Stack, Typography, useTheme} from '@mui/material';
import {isEmpty, size} from 'lodash';
import {FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch} from '../../../contexts/shopping-list-context';
import ShoppingListServices from '../../../services/shopping-list-services';
import CommonFormElements from './common-form-elements';

export function AddItemForm() {
	const dispatch = useShoppingListDispatch();
	const postNewShoppingListItem = ShoppingListServices.usePostNewShoppingListItemService(dispatch);

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
		if (isEmpty(name)) {
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

		void postNewShoppingListItem({
			name,
			description,
			quantity: Number(quantity),
		});

		navigate('/');
	};

	const styles: React.CSSProperties = {
		padding: '2.8rem 2.6rem 2.1rem 3rem',
	};

	return <form onSubmit={handleAdd}>
		<Grid container spacing={spacing()} style={styles}>
			<Grid item xs={12}>
				<Typography variant="primary">Add an Item</Typography>
				<Typography variant="secondary">Add your new item below</Typography>
			</Grid>
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
			<Grid item xs={12}>
				<Stack
					direction="row"
					spacing={1}
					justifyContent="flex-end"
				>
					<Button
						onClick={() => {
							navigate('/');
						}}
						variant="contained"
						color="secondary"
					>
					Cancel
					</Button>
					<Button
						onClick={handleAdd}
						variant="contained"
						type="submit"
					>
					Add Task
					</Button>
				</Stack>
			</Grid>
		</Grid>
	</form>;
}

export default AddItemForm;
