import {useCallback} from 'react';

export const useLogGroups = () => [
	useCallback((...args): void => {
		console.groupCollapsed.apply(null, args);
	}, []),
	useCallback((): void => {
		console.groupEnd();
	}, []),
];
