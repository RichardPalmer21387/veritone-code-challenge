import {filter, isEmpty, isNil, map} from 'lodash';
import log from 'loglevel';
import moment, {Moment} from 'moment';
import {Dispatch, useCallback} from 'react';
import {useAppState} from '../contexts/app-context';
import {DeleteShoppingItemAction, LoadShoppingItemsAction, PatchShoppingItemAction, PutNewShoppingItemAction, ShoppingListActionTypes} from '../contexts/shopping-list-context';
import {isPutResponseId, isSyncResponseModified, PutResponseId, ShoppingListDBRow, SyncResponseListItems, SyncResponseModified} from '../models/api-models';
import {IDBCursorWithShoppingListValues} from '../models/app-models';
import {PartialShoppingListItem, ShoppingListItem, ShoppingListState} from '../models/shopping-list-models';
import {VERITONE_SHOPPING_LIST, VERITONE_SHOPPING_LIST_OBJECT_STORE} from '../utils/use-indexeddb';
import {fetchHeaders as headers} from '../utils/util';

// Service Hooks
// =============================================================================
export function useLoadShoppingListService(dispatch: Dispatch<LoadShoppingItemsAction>): () => Promise<void> {
	const {localDB} = useAppState();

	return useCallback(async (): Promise<void> => new Promise((resolve, reject) => {
		log.info('Loading shopping list items from local and remote.');
		if (isNil(localDB)) {
			reject(new Error('Attempted access of localDB before initialization!'));
		} else {
			log.info('localDB found...');
			const listItems: ShoppingListState['listItems'] = [];
			// Open a read/write db transaction, ready for adding the data
			const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');

			transaction.addEventListener('error', () => {
				reject(transaction.error);
			});
			// Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
			const objectStore = transaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);
			let lastModified: Moment;
			objectStore.openCursor().onsuccess = async event => {
				const cursor = (event.target as IDBRequest<IDBCursorWithShoppingListValues>).result;
				log.info('Cursor opened.', cursor);
				// If there is still another cursor to go, keep runing this code
				if (cursor) {
					const modified = moment(cursor.value.modified);
					if (isNil(lastModified) || lastModified.isBefore(modified)) {
						lastModified = modified;
					}

					listItems.push({
						id: cursor.value.id,
						modified,
						name: cursor.value.name,
						description: cursor.value.description,
						quantity: cursor.value.quantity,
						purchased: cursor.value.purchased,
						deleted: cursor.value.deleted,
					});
					cursor.continue();
				} else {
					const response = await fetch(
						`/api/sync/${lastModified?.toISOString() ?? moment(0).toISOString()}`,
						{
							method: 'GET',
						},
					);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					const data: SyncResponseListItems | SyncResponseModified = await response.json();
					log.info('Load list items /api/sync response data', data);
					if (isSyncResponseModified(data)) {
						log.info('Server responded with last modified timestamp.');
						const newItems = filter(listItems, item => item.modified.isAfter(moment(data.modified)));
						if (!isEmpty(newItems)) {
							await fetch('/api/sync', {
								method: 'POST',
								body: JSON.stringify(newItems),
								headers,
							});
						}
					} else {
						log.info('Server responded with newly created list items.');
						await Promise.all(
							map(data, async row => {
								const newListItem = {
									id: row.id.toString(),
									modified: moment(row.modified),
									name: row.name,
									description: row.description,
									quantity: row.quantity,
									purchased: row.purchased,
									deleted: row.deleted,
								};
								return new Promise<void>((resolve, reject) => {
									// Open a read/write db transaction, ready for adding the data
									const transaction = localDB.transaction([VERITONE_SHOPPING_LIST], 'readwrite');
									// Report on the success of the transaction completing, when everything is done
									transaction.oncomplete = () => {
										log.info('Successfully added new item from sync.', newListItem);
										listItems.push(newListItem);
										resolve();
									};

									transaction.addEventListener('error', error => {
										log.error('Error adding new list item from sync', error, newListItem);
										reject(transaction.error);
									});

									// Call an object store that's already been added to the database
									const objectStore = transaction.objectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);
									log.info(objectStore.indexNames);
									log.info(objectStore.keyPath);
									log.info(objectStore.name);
									log.info(objectStore.transaction);
									log.info(objectStore.autoIncrement);

									// Make a request to add or update our newItem object to the object store
									objectStore.put({
										...newListItem,
										modified: newListItem.modified.toISOString(),
									});
								});
							}),
						);
					}

					log.info('Loaded list items:', listItems);
					dispatch({
						type: ShoppingListActionTypes.LOAD_SHOPPING_ITEMS,
						listItems,
					});
					resolve();
				}
			};
		}
	}), [localDB, dispatch]);
}

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
