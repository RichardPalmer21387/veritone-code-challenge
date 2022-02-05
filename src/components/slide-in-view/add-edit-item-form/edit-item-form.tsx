import {Button, Checkbox, FormControl, FormControlLabel, Grid, Stack, useTheme} from '@mui/material';
import {isEmpty, size} from 'lodash';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useShoppingListDispatch} from '../../../contexts/shopping-list-context';
import {ShoppingListItem} from '../../../models/shopping-list-models';
import ShoppingListServices from '../../../services/shopping-list-services';
import {useDisconnectionHandler} from '../../../utils/use-disconnection-handler';
import CommonFormElements from './common-form-elements';

export const EditItemForm = ({
	item,
}: {
	item: ShoppingListItem;
}) => {
	const dispatch = useShoppingListDispatch();
	const putShoppingListItem = ShoppingListServices.usePutShoppingListItemService(dispatch);
	const disconnectionHandler = useDisconnectionHandler(dispatch);

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

		disconnectionHandler(async () => putShoppingListItem({
			...item,
			name,
			description,
			quantity: Number(quantity),
			purchased,
		}));

		navigate('/');
	};

	const styles: React.CSSProperties = {
		padding: '2.8rem 2.6rem 2.1rem 3rem',
	};

	return (
		<form onSubmit={handleAdd}>
			<Grid container spacing={spacing()} style={styles}>
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
					<Stack
						direction="row"
						spacing={1}
						justifyContent="flex-end"
					>
						<Button
							color="secondary"
							onClick={() => {
								navigate('/');
							}}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							onClick={handleAdd}
						>
							Save Item
						</Button>
					</Stack>
				</Grid>
			</Grid>
		</form>
	);
};

export default EditItemForm;
