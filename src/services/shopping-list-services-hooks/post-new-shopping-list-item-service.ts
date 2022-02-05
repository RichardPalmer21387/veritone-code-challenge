import {isNil} from 'lodash';
import log from 'loglevel';
import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../../contexts/app-context';
import {PostNewShoppingItemAction, PutShoppingItemAction, ShoppingListActionTypes} from '../../contexts/shopping-list-context';
import {ShoppingListDBRow} from '../../models/api-models';
import {PartialShoppingListItem, ShoppingListItem} from '../../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../../utils/use-indexeddb';
import {fetchHeaders as headers} from '../../utils/util';

export function usePostNewShoppingListItemService(dispatch: Dispatch<PostNewShoppingItemAction | PutShoppingItemAction>): (newPartialListItem: PartialShoppingListItem) => Promise<void> {
	const {localDB} = useAppState();

	return useCallback(async newPartialListItem => new Promise((resolve, reject) => {
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			// Store a newListItem object to build off the newPartialListItem
			const newListItem: ShoppingListItem = {
				id: '',
				modified: moment(),
				name: newPartialListItem.name,
				description: newPartialListItem.description,
				quantity: newPartialListItem.quantity,
				purchased: false,
				deleted: false,
			};

			// Open a read/write db transaction, ready for adding the data
			const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
			// Report on the success of the transaction completing, when everything is done
			transaction.oncomplete = () => {
				log.info('DISPATCH local modifications to app state.');
				dispatch({
					type: ShoppingListActionTypes.POST_NEW_SHOPPING_ITEM,
					listItem: newListItem,
				});

				log.info('SENDING update request to backend...');
				fetch('/api', {
					method: 'POST',
					body: JSON.stringify({
						...newListItem,
						modified: newListItem.modified.toISOString(),
					}),
					headers,
				})
					.then(async response => response.json())
					.then((responseListItem: ShoppingListDBRow) => {
						// Open a read/write db transaction, ready for adding the data
						const dbSyncTransaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
						// Report on the success of the transaction completing, when everything is done
						dbSyncTransaction.oncomplete = () => {
							log.info('DISPATCH sync response from db to app state');
							dispatch({
								type: ShoppingListActionTypes.PUT_SHOPPING_ITEM,
								listItem: newListItem,
							});
							resolve();
						};

						dbSyncTransaction.addEventListener('error', () => {
							reject(dbSyncTransaction.error);
						});

						// Call an object store that's already been added to the database
						log.info('PUT update data in indexeddb from response', responseListItem);
						const objectStore = dbSyncTransaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);

						newListItem.id = responseListItem.id.toString(); // This may cause duplicate items to show up if server had items added from a different browser.

						// Make a request to add/update our newItem object to the object store
						objectStore.put({
							...newListItem,
							modified: newListItem.modified.toISOString(),
						});
					})
					.catch(error => {
						reject(error);
					});
			};

			transaction.addEventListener('error', () => {
				reject(transaction.error);
			});

			// Call an object store that's already been added to the database
			const objectStore = transaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);

			objectStore.openKeyCursor(null, 'prev').onsuccess = function (event) {
				const cursor = (event.target as IDBRequest<IDBCursor>).result;
				if (cursor) {
					// Make a request to add our newItem object to the object store
					newListItem.id = (Number(cursor.key) + 1).toString();
					objectStore.add({
						...newListItem,
						modified: newListItem.modified.toISOString(),
					});
				}
			};
		}
	}), [localDB, dispatch]);
}
