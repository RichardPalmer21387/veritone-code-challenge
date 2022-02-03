import {Box, Drawer, IconButton, Typography} from '@mui/material';
import React, {PropsWithChildren} from 'react';
import {useNavigate} from 'react-router-dom';
import {Icon} from '../icon';

const headerStyles: React.HTMLAttributes<HTMLDivElement>['style'] = {
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
};

const drawerStyles = {
	maxWidth: '56rem',
};

export function SlideInView({children, open}: PropsWithChildren<{open: boolean}>) {
	const navigate = useNavigate();

	return <Drawer
		anchor="right"
		className="slide-in-view"
		hideBackdrop
		open={open}
	>
		<Box className="slide-in-content-wrapper" style={drawerStyles}>
			<header style={headerStyles}>
				<Typography variant="h1">Shopping List</Typography>
				<IconButton
					onClick={
						() => {
							navigate('/');
						}
					}
				>
					<Icon name="last_page"/>
				</IconButton>
			</header>
			<Box pt={5.6}>
				{children}
			</Box>
		</Box>
	</Drawer>;
}

export default SlideInView;
