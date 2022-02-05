import {Dispatch} from 'react';
import {AppActionTypes, useAppDispatch, useAppState} from '../contexts/app-context';
import {LoadShoppingItemsAction} from '../contexts/shopping-list-context';
import {useLoadShoppingListService} from '../services/shopping-list-services-hooks/load-shopping-list-service';

export function useDisconnectionHandler(dispatch: Dispatch<LoadShoppingItemsAction>) {
	const {inDisconnectedState} = useAppState();
	const appDispatch = useAppDispatch();
	const loadShoppingListItems = useLoadShoppingListService(dispatch);

	return (actionCreator: () => Promise<unknown>) => {
		if (inDisconnectedState) {
			void loadShoppingListItems()
				.then(() => {
					appDispatch({
						type: AppActionTypes.SET_APP_IS_CONNECTED,
					});
				}).finally(() => {
					actionCreator().catch(() => {
						appDispatch({
							type: AppActionTypes.SET_APP_IS_DISCONNECTED,
						});
					});
				});
		} else {
			void actionCreator().catch(() => {
				appDispatch({
					type: AppActionTypes.SET_APP_IS_DISCONNECTED,
				});
			});
		}
	};
}
