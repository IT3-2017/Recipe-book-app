import * as fromShoppingList from '../app/reducers/shopping-list.reducer';
import * as fromAuth from '../app/reducers/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState{
    shoppingList: fromShoppingList.State,
    auth: fromAuth.State
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer
}