import {useDeleteShoppingListItemService} from './shopping-list-services-hooks/delete-shopping-list-item-service';
import {useLoadShoppingListService} from './shopping-list-services-hooks/load-shopping-list-service';
import {usePostNewShoppingListItemService} from './shopping-list-services-hooks/post-new-shopping-list-item-service';
import {usePutShoppingListItemService} from './shopping-list-services-hooks/put-shopping-list-item-service';

// Service Hooks
// =============================================================================
export const ShoppingListServices = {
	useLoadShoppingListService,
	usePostNewShoppingListItemService,
	useDeleteShoppingListItemService,
	usePutShoppingListItemService,
};

export default ShoppingListServices;
