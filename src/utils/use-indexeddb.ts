import log from 'loglevel';
import {useEffect} from 'react';
import {AppActionTypes, useAppDispatch} from '../contexts/app-context';

export const VERITONE_SHOPPING_LIST = 'veritone-shopping-list';
export const VERITONE_SHOPPING_LIST_OBJECT_STORE = 'veritone-shopping-list';
const DB_VER = 1;

export function useIndexedDb() {
	const appDispatch = useAppDispatch();
	useEffect(
		() => {
			const DBOpenRequest = window.indexedDB.open(VERITONE_SHOPPING_LIST, DB_VER);
			DBOpenRequest.addEventListener('error', event => {
				appDispatch({
					type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
					message: 'Error loading local database.',
				});
				log.error(event);
			});

			DBOpenRequest.onsuccess = () => {
				// Sync the result of the databse with app state.
				const db = DBOpenRequest.result;
				appDispatch({
					type: AppActionTypes.SET_LOCAL_DB,
					db,
				});
			};

			DBOpenRequest.onupgradeneeded = event => {
				const db: IDBDatabase = (event.target as IDBOpenDBRequest).result; // Strange, event isn't picking up the target type correctly here.

				db.addEventListener('error', event => {
					appDispatch({
						type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
						message: 'No Error loading local database.',
					});
					log.error(event);
				});

				// Create an objectStore for this database

				const objectStore = db.createObjectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE, {keyPath: 'id'});

				// Define what data items the objectStore will contain

				objectStore.createIndex('modified', 'modified', {unique: false});
				objectStore.createIndex('name', 'name', {unique: false});
				objectStore.createIndex('description', 'description', {unique: false});
				objectStore.createIndex('quantity', 'quantity', {unique: false});
			};
		},
		[],
	);
}
