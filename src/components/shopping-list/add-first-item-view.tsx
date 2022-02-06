import {Button, Typography} from '@mui/material';
import React from 'react';
import {createUseStyles} from 'react-jss';
import {useNavigate} from 'react-router-dom';

const useStyles = createUseStyles({
	'add-first-item': {
		display: 'flex',
		position: 'relative',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		alignSelf: 'center',
		border: '1px solid #C6C6C6',
		borderRadius: '5px',
		height: '29rem',
		width: '61.4rem',
	},
	'add-first-item-msg': {
		display: 'block',
		width: '100%',
		position: 'absolute',
		margin: '0 auto',
		transform: 'translate(0, -3.4rem)',
	},
});

export const AddFirstItemView = () => {
	const navigate = useNavigate();
	const classes = useStyles();
	return (
		<div className={classes['add-first-item']}>
			<Typography
				variant="primary"
				color="#87898C"
				className={classes['add-first-item-msg']}
			>Your shopping list is empty :(
			</Typography>
			<div>
				<Button
					variant="contained" onClick={() => {
						navigate('/add-new-item');
					}}
				>
					Add your first item
				</Button>
			</div>
		</div>
	);
};

export default AddFirstItemView;
