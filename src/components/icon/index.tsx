import React from 'react';

export const Icon = ({
	outlined,
	name,
}: {
	outlined?: boolean;
	name: 'edit' | 'delete' | 'last_page';
}) => <div className={`material-icons${outlined ? '-outlined' : ''}`}>{name}</div>;
