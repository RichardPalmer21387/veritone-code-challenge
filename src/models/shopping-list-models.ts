import {Moment} from 'moment';

export interface ShoppingListState {
	isLoading: boolean;
	listItems: ShoppingListItem[];
}

export interface ShoppingListItem {
	id: string;
	modified: Moment;
	name: string;
	description: string;
	quantity: number;
}
