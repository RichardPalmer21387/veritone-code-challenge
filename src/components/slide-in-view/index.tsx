import {Drawer} from '@mui/material';
import React, {PropsWithChildren} from 'react';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {};

export function SlideInView({children, open}: PropsWithChildren<{open: boolean}>) {
	return <Drawer
		anchor="right"
		style={styles}
		className="slide-in-view"
		hideBackdrop
		open={open}
	>
		<header>
			Shopping List
		</header>
		{children}
	</Drawer>;
}

export default SlideInView;
