import {isNil} from 'lodash';
import log from 'loglevel';
import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../contexts/app-context';
import {LoadShoppingItemsAction, PutNewShoppingItemAction, ShoppingListActionTypes, useShoppingListDispatch} from '../contexts/shopping-list-context';
import {IDBCursorWithShoppingListValues} from '../models/app-models';
import {ShoppingListItem, ShoppingListState} from '../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../utils/use-indexeddb';

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
			const objectStore = localDB.transaction(VERITONE_SHOPPING_LIST).objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);
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

export function usePutNewShoppingListItemService(dispatch: Dispatch<PutNewShoppingItemAction>): (newListItem: ShoppingListItem) => Promise<void> {
	const {localDB} = useAppState();
	const shoppingListDispatch = useShoppingListDispatch();

	return useCallback(async newListItem => new Promise((resolve, reject) => {
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			// Open a read/write db transaction, ready for adding the data
			const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
			// Report on the success of the transaction completing, when everything is done
			transaction.oncomplete = () => {
				shoppingListDispatch({
					type: ShoppingListActionTypes.PUT_NEW_SHOPPING_ITEM,
					listItem: newListItem,
				});
				resolve();
			};

			transaction.addEventListener('error', () => {
				reject(transaction.error);
			});

			// Call an object store that's already been added to the database
			const objectStore = transaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);
			log.info(objectStore.indexNames);
			log.info(objectStore.keyPath);
			log.info(objectStore.name);
			log.info(objectStore.transaction);
			log.info(objectStore.autoIncrement);

			// Get count from localdb so we can use that as an index.
			const countRequest = objectStore.count();
			countRequest.onsuccess = () => {
				const newIndex = countRequest.result;

				// Make a request to add our newItem object to the object store
				objectStore.add({
					id: newIndex,
					modified: moment().toISOString(),
					name: newListItem.name,
					description: newListItem.description,
					quantity: newListItem.quantity,
				});
			};
		}
	}), [dispatch]);
}
