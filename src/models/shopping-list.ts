export interface ShoppingListState {
	isLoading: boolean;
	listItems: ShoppingListItem[];
}

interface ShoppingListItem {
	id: string;
	name: string;
	description: string;
	quantity: number;
}
