import React from 'react';
import {headerStyles} from '../header';
import Spinner from '../spinner';

const styles: React.HTMLAttributes<HTMLDivElement>['style'] = {
	display: 'flex',
	justifyContent: 'center',
	minHeight: `calc(100vh - ${headerStyles?.height ?? 0})`,
	width: '100%',
};

export function ShoppingList() {
	return <main style={styles} className="shopping-list">
		<Spinner />
	</main>;
}

export default ShoppingList;
