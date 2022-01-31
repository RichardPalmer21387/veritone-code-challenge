import log from 'loglevel';
import {useEffect} from 'react';
import {AppActionTypes, useAppDispatch} from '../contexts/app-context';

export const VERITONE_SHOPPING_LIST = 'veritone-shopping-list';
export const VERITONE_SHOPPING_LIST_OBJECT_STORE = 'veritone-shopping-list';
const DB_VER = 9;

export function useIndexedDb() {
	const appDispatch = useAppDispatch();
	useEffect(
		() => {
			log.info('Open IndexedDB:', VERITONE_SHOPPING_LIST, DB_VER);
			const DBOpenRequest = window.indexedDB.open(VERITONE_SHOPPING_LIST, DB_VER);
			DBOpenRequest.addEventListener('error', event => {
				log.info('Failed loading local database.');
				appDispatch({
					type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
					message: 'Error loading local database.',
				});
				log.error(event);
			});

			DBOpenRequest.onsuccess = () => {
				log.info('Succeded loading local database.');
				// Sync the result of the databse with app state.
				const db = DBOpenRequest.result;
				appDispatch({
					type: AppActionTypes.SET_LOCAL_DB,
					db,
				});
				log.info('Successfully initialized indexeddb.');
			};

			DBOpenRequest.onupgradeneeded = event => {
				log.info('IndexedDB upgrade needed.');
				const db: IDBDatabase = (event.target as IDBOpenDBRequest).result; // Strange, event isn't picking up the target type correctly here.

				db.addEventListener('error', event => {
					appDispatch({
						type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
						message: 'No Error loading local database.',
					});
					log.error(event);
				});

				if (db.objectStoreNames.contains(VERITONE_SHOPPING_LIST_OBJECT_STORE)) {
					log.info('Deleting old ObjectStore');
					db.deleteObjectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE);
				}

				// Create an objectStore for this database
				log.info('Creating new ObjectStore');
				const objectStore = db.createObjectStore(VERITONE_SHOPPING_LIST_OBJECT_STORE, {keyPath: 'id'});

				// Define what data items the objectStore will contain

				objectStore.createIndex('modified', 'modified', {unique: false});
				objectStore.createIndex('name', 'name', {unique: false});
				objectStore.createIndex('description', 'description', {unique: false});
				objectStore.createIndex('quantity', 'quantity', {unique: false});
				objectStore.createIndex('purchased', 'purchased', {unique: false});
				objectStore.createIndex('deleted', 'deleted', {unique: false});

				log.info('Finished IndexedDB upgrade.');
			};
		},
		[appDispatch],
	);
}
