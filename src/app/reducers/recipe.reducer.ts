import * as RecipeActions from '../actions/recipe.actions';
import { Recipe } from '../recipes/recipe.model';

export interface State {
    recipes: Recipe[];
}

const initialState : State = {
    recipes: []
}

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions){
    switch(action.type){
        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };

        case RecipeActions.ADD_RECIPE:
                return {
                    ...state,
                    recipes: [...state.recipes, action.payload] //kopiramo staro stanje tj niz recepata pa dodamo samo novi iz payload-a
                };

        case RecipeActions.UPDATE_RECIPE:
            const updatedRecipe = {...state.recipes[action.payload.index], ...action.payload.newRecipe}; // prvo napravimo kopiju starog recepta, pa onda pregazimo sve stare vrednosti propertija sa novim iz ovog ...action.payload
            
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = updatedRecipe; //update-ujemo nas recept u kopiranoj listi

                    return {
                        ...state,
                        recipes: updatedRecipes
                    };
        case RecipeActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter( ( recipe, index) =>{
                    return index !== action.payload;
                })
            };
        default:
            return state;
    }
}