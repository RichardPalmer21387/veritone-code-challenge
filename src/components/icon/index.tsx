import React from 'react';

export function Icon(
	{
		outlined,
		name,
	}: {
		outlined?: boolean;
		name: 'edit' | 'delete' | 'last_page';
	},
) {
	return <div className={`material-icons${outlined ? '-outlined' : ''}`}>{name}</div>;
}
