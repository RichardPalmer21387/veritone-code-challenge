import log from 'loglevel';
import {AppActionTypes, useAppDispatch} from '../contexts/app-context';

export function useIndexedDb() {
	const appDispatch = useAppDispatch();

	const DBOpenRequest = window.indexedDB.open('veritone-shopping-cart', 1);
	DBOpenRequest.addEventListener('error', event => {
		appDispatch({
			type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
			message: 'Error loading local database.',
		});
		log.error(event);
	});

	DBOpenRequest.onsuccess = () => {
		// Sync the result of the databse with app state.
		appDispatch({
			type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
			message: 'No Error loading local database.',
		});
	};

	DBOpenRequest.onupgradeneeded = event => {
		const db: IDBDatabase = (event.target as IDBOpenDBRequest)?.result; // Strange, event isn't picking up the target type correctly here.

		db.addEventListener('error', event => {
			appDispatch({
				type: AppActionTypes.SHOW_ERROR_MESSAGE_SNACKBAR,
				message: 'No Error loading local database.',
			});
			log.error(event);
		});

		// Create an objectStore for this database

		const objectStore = db.createObjectStore('veritone-shopping-list', {keyPath: 'id'});

		// Define what data items the objectStore will contain

		objectStore.createIndex('modified', 'modified', {unique: false});
		objectStore.createIndex('name', 'name', {unique: false});
		objectStore.createIndex('description', 'description', {unique: false});
		objectStore.createIndex('quantity', 'quantity', {unique: false});
	};
}
