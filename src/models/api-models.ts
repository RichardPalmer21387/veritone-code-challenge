import {includes, isArray, keys} from 'lodash';
import {ShoppingListItem} from './shopping-list-models';

export type SyncResponseListItems = ShoppingListItem[];
export interface SyncResponseModified {
	modified: string;
}
export interface PutResponseId {
	id: string;
}

export interface ShoppingListDBRow extends Omit<ShoppingListItem, 'modified' | 'id'> {
	modified: string;
	id: number;
}

export function isPutResponseId(data: PutResponseId | ShoppingListDBRow): data is PutResponseId {
	return !includes(keys(data), 'modified');
}

export function isSyncResponseModified(data: SyncResponseModified | SyncResponseListItems): data is SyncResponseModified {
	return !isArray(data);
}
