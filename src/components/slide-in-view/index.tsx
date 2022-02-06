import {Box, Drawer, IconButton, Typography} from '@mui/material';
import React, {PropsWithChildren} from 'react';
import {createUseStyles} from 'react-jss';
import {useNavigate} from 'react-router-dom';
import {Icon} from '../icon';

const useStyles = createUseStyles({
	'drawer-header': {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		maxWidth: '56rem',
		height: '64px',
		background: '#FAFAFA',
		borderBottom: '0.05rem solid #D5DFE9',
		textTransform: 'uppercase',
		padding: '0 2rem 0 3rem',
		boxSizing: 'border-box',
		position: 'fixed',
		zIndex: 10,
	},
	'drawer-content-wrapper': {
		height: '100%',
		width: '100vw',
		maxWidth: '56rem',
	},
});

export const SlideInView = ({children, open}: PropsWithChildren<{open: boolean}>) => {
	const navigate = useNavigate();

	const classes = useStyles();
	return (
		<Drawer
			hideBackdrop
			anchor="right"
			className="slide-in-view"
			open={open}
		>
			<Box className={classes['drawer-content-wrapper']}>
				<header className={classes['drawer-header']}>
					<Typography variant="h1">Shopping List</Typography>
					<IconButton
						onClick={() => {
							navigate('/');
						}}
					>
						<Icon name="last_page"/>
					</IconButton>
				</header>
				<Box pt={5.6} height="100%" display="flex" flexDirection="column" boxSizing="border-box">
					{children}
				</Box>
			</Box>
		</Drawer>
	);
};

export default SlideInView;
