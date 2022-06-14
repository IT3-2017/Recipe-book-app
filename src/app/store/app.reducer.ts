import * as fromShoppingList from '../reducers/shopping-list.reducer';
import * as fromAuth from '../reducers/auth.reducer';
import * as fromRecipe from '../reducers/recipe.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState{
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
    recipes: fromRecipe.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipe.recipeReducer
}