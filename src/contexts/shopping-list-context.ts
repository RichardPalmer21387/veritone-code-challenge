import {Action} from '../utils/util-types';
import {prepareContext} from '../utils/prepare-context';
import {ShoppingListState} from '../models/shopping-list-models';

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
	PATCH_SHOPPING_ITEM = 'PATCH_SHOPPING_ITEM',
	PUT_NEW_SHOPPING_ITEM = 'PUT_NEW_SHOPPING_ITEM',
}

type DeleteShoppingItemAction = Action<ShoppingListActionTypes.DELETE_SHOPPING_ITEM, {itemId: string}>;
type LoadShoppingItemsAction = Action<ShoppingListActionTypes.LOAD_SHOPPING_ITEMS>;
type PatchShoppingItemAction = Action<ShoppingListActionTypes.PATCH_SHOPPING_ITEM, {itemId: string}>;
type PutNewShoppingItemAction = Action<ShoppingListActionTypes.PUT_NEW_SHOPPING_ITEM, unknown>;

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
				isLoading: false,
			};
		case ShoppingListActionTypes.DELETE_SHOPPING_ITEM:
		case ShoppingListActionTypes.PATCH_SHOPPING_ITEM:
		case ShoppingListActionTypes.PUT_NEW_SHOPPING_ITEM:
		default:
			return state;
	}
};

// Prepare Context
// =============================================================================
export const [ShoppingListProvider, useShoppingListState, useShoppingListDispatch] = prepareContext(reducer, initialState);
