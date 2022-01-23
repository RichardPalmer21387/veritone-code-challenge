import React, {useEffect, useRef} from 'react';
import {Alert, Snackbar} from '@mui/material';
import {isEmpty} from 'lodash';
import {AppActionTypes, useAppDispatch, useAppState} from '../../contexts/app-context';

export function ErrorSnackbar() {
	const appState = useAppState();
	const appDispatch = useAppDispatch();
	const handleClose = () => {
		appDispatch({
			type: AppActionTypes.CLEAR_ERROR_MESSAGE_SNACKBAR,
		});
	};

	const message = useRef<string | null>(appState.errorMessage);

	useEffect(() => {
		message.current = appState.errorMessage ?? message.current; // Holds on to the message durring animate out.
	}, [appState.errorMessage]);

	return <Snackbar open={!isEmpty(appState.errorMessage)} autoHideDuration={6000} onClose={handleClose}>
		<Alert severity="error" sx={{width: '100%'}} onClose={handleClose}>
			{message.current}
		</Alert>
	</Snackbar>;
}
