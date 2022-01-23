import {Action} from '../utils/util-types';
import {prepareContext} from '../utils/prepare-context';
import {AppState} from '../models/app-models';

// State
// =============================================================================
const initialState: AppState = {
	errorMessage: null,
	localDB: null,
};

// Actions
// =============================================================================
export enum AppActionTypes {
	SHOW_ERROR_MESSAGE_SNACKBAR = 'SHOW_ERROR_MESSAGE_SNACKBAR',
	CLEAR_ERROR_MESSAGE_SNACKBAR = 'CLEAR_ERROR_MESSAGE_SNACKBAR',
	SET_LOCAL_DB = 'SET_LOCAL_DB',
}

type ShowErrorMessageSnackbarAction = Action<AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR, {message: string}>;
type ClearErrorMessageSnackbarAction = Action<AppActionTypes.CLEAR_ERROR_MESSAGE_SNACKBAR>;
type SetLocalDB = Action<AppActionTypes.SET_LOCAL_DB, {db: IDBDatabase}>;

// Interfaces & Types
// =============================================================================
type AppAction = ShowErrorMessageSnackbarAction | ClearErrorMessageSnackbarAction | SetLocalDB;

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
		default:
			return state;
	}
};

// Prepare Context
// =============================================================================
export const [AppProvider, useAppState, useAppDispatch] = prepareContext(reducer, initialState);
