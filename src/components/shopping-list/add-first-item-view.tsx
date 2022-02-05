import {Button, Typography} from '@mui/material';
import React from 'react';
import {useNavigate} from 'react-router-dom';

const styles: React.CSSProperties = {
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
};

export const AddFirstItemView = () => {
	const navigate = useNavigate();
	return (
		<div style={styles} className="add-first-item">
			<Typography
				variant="h6"
				color="#87898C"
				style={{
					display: 'block',
					width: '100%',
					position: 'absolute',
					margin: '0 auto',
					transform: 'translate(0, -3.4rem)',
				}}
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
