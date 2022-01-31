import {assign, map, reject} from 'lodash';
import {Action} from '../utils/util-types';
import {prepareContext} from '../utils/prepare-context';
import {ShoppingListItem, ShoppingListState} from '../models/shopping-list-models';

// State
// =============================================================================
const initialState: ShoppingListState = {
	isLoading: true,
	listItems: [],
};

// Actions
// =============================================================================
export enum ShoppingListActionTypes {
	DELETE_SHOPPING_ITEM = 'DELETE_SHOPPING_ITEM',
	LOAD_SHOPPING_ITEMS = 'LOAD_SHOPPING_ITEMS',
	PUT_SHOPPING_ITEM = 'PUT_SHOPPING_ITEM',
	POST_NEW_SHOPPING_ITEM = 'POST_NEW_SHOPPING_ITEM',
}

export type DeleteShoppingItemAction = Action<ShoppingListActionTypes.DELETE_SHOPPING_ITEM, {itemId: string}>;
export type LoadShoppingItemsAction = Action<ShoppingListActionTypes.LOAD_SHOPPING_ITEMS, {listItems: ShoppingListState['listItems']}>;
export type PatchShoppingItemAction = Action<ShoppingListActionTypes.PUT_SHOPPING_ITEM, {listItem: ShoppingListItem}>;
export type PutNewShoppingItemAction = Action<ShoppingListActionTypes.POST_NEW_SHOPPING_ITEM, {listItem: ShoppingListItem}>;

// Interfaces & Types
// =============================================================================
type ShoppingListAction = DeleteShoppingItemAction | LoadShoppingItemsAction | PatchShoppingItemAction | PutNewShoppingItemAction;

// Reducer
// =============================================================================
const reducer = (state: ShoppingListState, action: ShoppingListAction): ShoppingListState => {
	switch (action.type) {
		case ShoppingListActionTypes.LOAD_SHOPPING_ITEMS:
			return {
				...state,
				listItems: action.listItems,
				isLoading: false,
			};
		case ShoppingListActionTypes.POST_NEW_SHOPPING_ITEM:
			return {
				...state,
				listItems: [
					...state.listItems,
					action.listItem,
				],
			};
		case ShoppingListActionTypes.DELETE_SHOPPING_ITEM:
			return {
				...state,
				listItems: reject(state.listItems, item => item.id === action.itemId),
			};
		case ShoppingListActionTypes.PUT_SHOPPING_ITEM:
			return {
				...state,
				listItems: map(
					state.listItems,
					item => item.id === action.listItem.id
						? assign(item, action.listItem)
						: item,
				),
			};
		default:
			return state;
	}
};

// Prepare Context
// =============================================================================
export const [ShoppingListProvider, useShoppingListState, useShoppingListDispatch] = prepareContext(reducer, initialState);
