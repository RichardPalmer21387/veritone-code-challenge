import {isNil} from 'lodash';
import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../contexts/app-context';
import {LoadShoppingItemsAction, ShoppingListActionTypes, useShoppingListDispatch} from '../contexts/shopping-list-context';
import {IDBCursorWithShoppingListValues} from '../models/app-models';
import {ShoppingListState} from '../models/shopping-list-models';
import {VERITONE_SHOPPING_CART} from '../utils/use-indexeddb';

// Service Hooks
// =============================================================================
export function useLoadShoppingListService(dispatch: Dispatch<LoadShoppingItemsAction>): () => Promise<void> {
	const {localDB} = useAppState();
	const shoppingListDispatch = useShoppingListDispatch();

	return useCallback(async (): Promise<void> => new Promise((resolve, reject) => {
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			// Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
			const objectStore = localDB.transaction(VERITONE_SHOPPING_CART).objectStore(VERITONE_SHOPPING_CART);
			const listItems: ShoppingListState['listItems'] = [];
			objectStore.openCursor().onsuccess = event => {
				const cursor = (event.target as IDBRequest<IDBCursorWithShoppingListValues>).result;
				// If there is still another cursor to go, keep runing this code
				if (cursor) {
					listItems.push({
						id: cursor.value.id,
						modified: moment(cursor.value.modified),
						name: cursor.value.name,
						description: cursor.value.description,
						quantity: cursor.value.quantity,
					});
					cursor.continue();
				} else {
					shoppingListDispatch({
						type: ShoppingListActionTypes.LOAD_SHOPPING_ITEMS,
						listItems,
					});
					resolve();
				}
			};
		}
	}), [dispatch, localDB]);
}
