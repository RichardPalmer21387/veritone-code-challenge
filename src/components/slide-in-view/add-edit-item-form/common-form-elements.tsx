import {FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import {size} from 'lodash';
import React from 'react';

export function CommonFormElements({
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
}) {
	return <>
		<Grid item xs={12}>
			<FormControl fullWidth error={!nameValid}>
				<TextField
					id="name"
					label="Name"
					variant="outlined"
					value={name}
					error={!nameValid}
					helperText={!nameValid && 'A name is required.'}
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
				style={{
					position: 'relative',
				}}
			>
				<TextField
					id="description"
					label="Description"
					multiline
					rows={5}
					variant="outlined"
					error={!descriptionValid}
					value={description}
					onChange={event => {
						setDescription(event.target.value);
					}}
				/>
				<FormHelperText
					style={{
						position: 'absolute',
						right: '1rem',
						bottom: '1rem',
					}}
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
	</>;
}

export default CommonFormElements;
