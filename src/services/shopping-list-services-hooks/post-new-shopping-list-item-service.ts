import {isNil} from 'lodash';
import log from 'loglevel';
import moment from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../../contexts/app-context';
import {PutNewShoppingItemAction, ShoppingListActionTypes} from '../../contexts/shopping-list-context';
import {ShoppingListDBRow} from '../../models/api-models';
import {PartialShoppingListItem, ShoppingListItem} from '../../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../../utils/use-indexeddb';
import {fetchHeaders as headers} from '../../utils/util';

export function usePostNewShoppingListItemService(dispatch: Dispatch<PutNewShoppingItemAction>): (newPartialListItem: PartialShoppingListItem) => Promise<void> {
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
					const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
					// Report on the success of the transaction completing, when everything is done
					transaction.oncomplete = () => {
						dispatch({
							type: ShoppingListActionTypes.POST_NEW_SHOPPING_ITEM,
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

					newListItem.id = responseListItem.id.toString();

					// Make a request to add our newItem object to the object store
					objectStore.add({
						...newListItem,
						modified: newListItem.modified.toISOString(),
					});
				})
				.catch(error => {
					reject(error);
				});
		}
	}), [localDB, dispatch]);
}
