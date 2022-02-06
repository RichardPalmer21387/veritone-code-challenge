import {Typography} from '@mui/material';
import React from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles({
	'app-header': {
		alignItems: 'center',
		backgroundColor: '#4D81B7',
		boxSizing: 'border-box',
		color: 'white',
		display: 'flex',
		height: '64px',
		minHeight: '64px', // Fix for height scaling with vh in firefox.
		paddingLeft: '30px',
		width: '100%',
	},
});

export const Header = () => {
	const classes = useStyles();
	return (
		<header className={classes['app-header']}>
			<Typography variant="h1">Shopping List</Typography>
		</header>
	);
};

export default Header;
