import React, {PropsWithChildren} from 'react';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	position: 'absolute',
	top: '0px',
	right: '0px',
	bottom: '0px',
	background: 'white',
	maxWidth: '560px',
};

export function SlideInView({children}: PropsWithChildren<unknown>) {
	return <div style={styles} className="slide-in-view">
		<header>
			Shopping List
		</header>
		{children}
	</div>;
}

export default SlideInView;
