import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {size} from 'lodash';
import React from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
	'description-form-control': {
		position: 'relative',
	},
	'description-helper-text': {
		position: 'absolute',
		right: '1rem',
		bottom: '1rem',
	},
});

export const CommonFormElements = ({
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
	setName: (value: string) => void;
	setDescription: (value: string) => void;
	setQuantity: (value: string) => void;
}) => {
	const classes = useStyles();
	return (
		<>
			<Grid item xs={12}>
				<FormControl fullWidth error={!nameValid}>
					<TextField
						id="name"
						label="Name"
						variant="outlined"
						value={name}
						error={!nameValid}
						helperText={!nameValid && 'A name must be provided and be less than 100 characters.'}
						onChange={event => {
							setName(event.target.value);
						}}
					/>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<FormControl
					fullWidth
					error={!descriptionValid}
					className={classes['description-form-control']}
				>
					<TextField
						multiline
						id="description"
						label="Description"
						rows={5}
						variant="outlined"
						error={!descriptionValid}
						value={description}
						onChange={event => {
							setDescription(event.target.value);
						}}
					/>
					<FormHelperText
						className={classes['description-helper-text']}
					>
						{size(description)}/100
					</FormHelperText>
				</FormControl>
			</Grid>
			<Grid item xs={12}>
				<FormControl fullWidth error={!quantityValid}>
					<InputLabel id="quantity-label">How many?</InputLabel>
					<Select
						labelId="quantity-label"
						id="quantity"
						label="How many?"
						placeholder="How many?"
						value={quantity}
						onChange={event => {
							setQuantity(event.target.value);
						}}
					>
						<MenuItem value="1">1</MenuItem>
						<MenuItem value="2">2</MenuItem>
						<MenuItem value="3">3</MenuItem>
					</Select>
					{!quantityValid && <FormHelperText>A quantity must be provided.</FormHelperText>}
				</FormControl>
			</Grid>
		</>
	);
};

export default CommonFormElements;
