import {Button} from '@mui/material';
import React from 'react';
import {Link} from 'react-router-dom';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	textAlign: 'center',
	alignSelf: 'center',
	border: '1px solid #C6C6C6',
	borderRadius: '5px',
	height: '29rem',
	width: '61.4rem',
};

export function AddFirstItemView() {
	return <div style={styles} className="add-first-item">
		<div>Your shopping list is empty :(</div>
		<div>
			<Link to="/add-new-item">
				<Button>
					Add your first item
				</Button>
			</Link>
		</div>
	</div>;
}

export default AddFirstItemView;
