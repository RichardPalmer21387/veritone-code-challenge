import {Action} from '../utils/util-types';
import {prepareContext} from '../utils/prepare-context';
import {AppState} from '../models/app-models';

// State
// =============================================================================
const initialState: AppState = {
	errorMessage: null,
	localDB: null,
	inDisconnectedState: false,
};

// Actions
// =============================================================================
export enum AppActionTypes {
	SHOW_ERROR_MESSAGE_SNACKBAR = 'SHOW_ERROR_MESSAGE_SNACKBAR',
	CLEAR_ERROR_MESSAGE_SNACKBAR = 'CLEAR_ERROR_MESSAGE_SNACKBAR',
	SET_LOCAL_DB = 'SET_LOCAL_DB',
	SET_APP_IS_DISCONNECTED = 'SET_APP_IS_DISCONNECTED',
	SET_APP_IS_CONNECTED = 'SET_APP_IS_CONNECTED',
}

type ShowErrorMessageSnackbarAction = Action<AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR, {message: string}>;
type ClearErrorMessageSnackbarAction = Action<AppActionTypes.CLEAR_ERROR_MESSAGE_SNACKBAR>;
type SetLocalDBAction = Action<AppActionTypes.SET_LOCAL_DB, {db: IDBDatabase}>;
type SetAppIsDisconnectedAction = Action<AppActionTypes.SET_APP_IS_DISCONNECTED>;
type SetAppIsConnectedAction = Action<AppActionTypes.SET_APP_IS_CONNECTED>;

// Interfaces & Types
// =============================================================================
type AppAction = ShowErrorMessageSnackbarAction
| ClearErrorMessageSnackbarAction
| SetLocalDBAction
| SetAppIsDisconnectedAction
| SetAppIsConnectedAction;

// Reducer
// =============================================================================
const reducer = (state: AppState, action: AppAction): AppState => {
	switch (action.type) {
		case AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR:
			return {
				...state,
				errorMessage: action.message,
			};
		case AppActionTypes.CLEAR_ERROR_MESSAGE_SNACKBAR:
			return {
				...state,
				errorMessage: null,
			};
		case AppActionTypes.SET_LOCAL_DB:
			return {
				...state,
				localDB: action.db,
			};
		case AppActionTypes.SET_APP_IS_CONNECTED:
			return {
				...state,
				inDisconnectedState: false,
			};
		case AppActionTypes.SET_APP_IS_DISCONNECTED:
			return {
				...state,
				inDisconnectedState: true,
			};
		default:
			return state;
	}
};

// Prepare Context
// =============================================================================
export const [AppProvider, useAppState, useAppDispatch] = prepareContext(reducer, initialState);
