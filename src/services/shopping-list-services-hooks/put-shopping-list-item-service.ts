import {clone, isNil} from 'lodash';
import log from 'loglevel';
import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../../contexts/app-context';
import {PutShoppingItemAction, ShoppingListActionTypes} from '../../contexts/shopping-list-context';
import {isPutResponseId, PutResponseId, ShoppingListDBRow} from '../../models/api-models';
import {ShoppingListItem} from '../../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../../utils/use-indexeddb';
import {fetchHeaders as headers} from '../../utils/util';

export function usePutShoppingListItemService(dispatch: Dispatch<PutShoppingItemAction>): (updateListItem: ShoppingListItem) => Promise<void> {
	const {localDB} = useAppState();

	return useCallback(async updateListItem => new Promise((resolve, reject) => {
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			// Get new modified moment.
			let modified = moment();
			// Create modifiable copy of updated list item
			let resolvedUpdateListItem = {
				...clone(updateListItem),
				modified,
			};

			const putListItem = {
				id: updateListItem.id,
				modified: modified.toISOString(),
				name: updateListItem.name,
				description: updateListItem.description,
				quantity: updateListItem.quantity,
				purchased: updateListItem.purchased,
				deleted: updateListItem.deleted,
			};

			// Open a read/write db transaction, ready for adding the data
			const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
			// Report on the success of the transaction completing, when everything is done
			transaction.oncomplete = () => {
				log.info('DISPATCH local modifications to app state.');
				dispatch({
					type: ShoppingListActionTypes.PUT_SHOPPING_ITEM,
					listItem: {
						...resolvedUpdateListItem,
					},
				});

				log.info('SENDING update request to backend...');
				fetch(`/api/${putListItem.id}`, {
					method: 'PUT',
					body: JSON.stringify(putListItem),
					headers,
				})
					.then(async response => response.json())
					.then((response: PutResponseId | ShoppingListDBRow) => {
						// Open a read/write db transaction, ready for adding the data
						const dbSyncTransaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
						// Report on the success of the transaction completing, when everything is done
						dbSyncTransaction.oncomplete = () => {
							log.info('DISPATCH sync response from db to app state');
							dispatch({
								type: ShoppingListActionTypes.PUT_SHOPPING_ITEM,
								listItem: {
									...resolvedUpdateListItem,
								},
							});
							resolve();
						};

						dbSyncTransaction.addEventListener('error', () => {
							reject(dbSyncTransaction.error);
						});

						// Call an object store that's already been added to the database
						log.info('PUT update data in indexeddb from response', response);
						const objectStore = dbSyncTransaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);

						if (isPutResponseId(response)) {
							// Make a request to update our newItem object to the object store
							log.info('PUT BY ID:', putListItem);
							objectStore.put({
								...putListItem,
								id: response.id,
							});
						} else {
							log.info('PUT BY UPDATED RESPONSE ROW:', response);
							// Or we have a newer version on remote and need to update our local.
							modified = moment(response.modified);

							// Update our local state to match latest data from server using last-modified conflict resolution.
							resolvedUpdateListItem = {
								...response,
								id: response.id.toString(),
								modified: moment(response.modified),
							};

							objectStore.put({
								...response,
								modified: modified.toISOString(),
								id: response.id.toString(),
							});
						}
					})
					.catch(error => {
						reject(error);
					});
			};

			transaction.addEventListener('error', () => {
				reject(transaction.error);
			});

			// Call an object store that's already been added to the database
			log.info('PUT update data in indexeddb pre-send', putListItem);
			const objectStore = transaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);

			// Make a request to update our newItem object to the object store
			objectStore.put(putListItem);
		}
	}), [localDB, dispatch]);
}
