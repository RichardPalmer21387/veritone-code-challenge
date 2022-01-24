import React from 'react';

export function Icon(
	{
		name,
	}: {
		name: 'edit' | 'delete';
	},
) {
	return <div className="material-icons">{name}</div>;
}
