export interface AppState {
	errorMessage: string | null;
	localDB: IDBDatabase | null;
}

export interface IDBCursorWithShoppingListValues extends IDBCursor {
	readonly value: {
		id: string;
		modified: string;
		name: string;
		description: string;
		quantity: number;
		purchased: boolean;
	};
}
