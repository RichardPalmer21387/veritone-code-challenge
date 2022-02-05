export interface AppState {
	errorMessage: string | null;
	localDB: IDBDatabase | null;
	inDisconnectedState: boolean;
}

export interface IDBCursorWithShoppingListValues extends IDBCursor {
	readonly value: {
		id: string;
		modified: string;
		name: string;
		description: string;
		quantity: number;
		purchased: boolean;
		deleted: boolean;
	};
}
