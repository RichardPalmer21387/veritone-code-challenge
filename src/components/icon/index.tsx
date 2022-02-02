import React from 'react';

export function Icon(
	{
		name,
	}: {
		name: 'edit' | 'delete' | 'last_page';
	},
) {
	return <div className="material-icons">{name}</div>;
}
