import {isNil} from 'lodash';
import log from 'loglevel';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../../contexts/app-context';
import {DeleteShoppingItemAction, ShoppingListActionTypes} from '../../contexts/shopping-list-context';
import {ShoppingListItem} from '../../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../../utils/use-indexeddb';

export function useDeleteShoppingListItemService(dispatch: Dispatch<DeleteShoppingItemAction>): (listItemId: ShoppingListItem['id']) => Promise<void> {
	const {localDB} = useAppState();

	return useCallback(async listItemId => new Promise((resolve, reject) => {
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			// Open a read/write db transaction, ready for adding the data
			const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
			transaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE).delete(listItemId);
			// Report on the success of the transaction completing, when everything is done
			transaction.oncomplete = () => {
				dispatch({
					type: ShoppingListActionTypes.DELETE_SHOPPING_ITEM,
					itemId: listItemId,
				});
				resolve();
			};

			transaction.addEventListener('error', () => {
				log.error(transaction.error);
				reject(transaction.error);
			});
		}
	}), [localDB, dispatch]);
}
