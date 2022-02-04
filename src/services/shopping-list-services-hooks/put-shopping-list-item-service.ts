import {isNil} from 'lodash';
import log from 'loglevel';
import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../../contexts/app-context';
import {PatchShoppingItemAction, ShoppingListActionTypes} from '../../contexts/shopping-list-context';
import {isPutResponseId, PutResponseId, ShoppingListDBRow} from '../../models/api-models';
import {ShoppingListItem} from '../../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../../utils/use-indexeddb';
import {fetchHeaders as headers} from '../../utils/util';

export function usePutShoppingListItemService(dispatch: Dispatch<PatchShoppingItemAction>): (updateListItem: ShoppingListItem) => Promise<void> {
	const {localDB} = useAppState();

	return useCallback(async updateListItem => new Promise((resolve, reject) => {
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			// Get new modified moment.
			let modified = moment();

			const putListItem = {
				id: updateListItem.id,
				modified: modified.toISOString(),
				name: updateListItem.name,
				description: updateListItem.description,
				quantity: updateListItem.quantity,
				purchased: updateListItem.purchased,
				deleted: updateListItem.deleted,
			};

			fetch(`/api/${putListItem.id}`, {
				method: 'PUT',
				body: JSON.stringify(putListItem),
				headers,
			})
				.then(async response => response.json())
				.then((response: PutResponseId | ShoppingListDBRow) => {
					// Open a read/write db transaction, ready for adding the data
					const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
					// Report on the success of the transaction completing, when everything is done
					transaction.oncomplete = () => {
						dispatch({
							type: ShoppingListActionTypes.PUT_SHOPPING_ITEM,
							listItem: {
								...updateListItem,
								modified,
							},
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
		}
	}), [localDB, dispatch]);
}
