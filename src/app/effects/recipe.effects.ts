import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import * as RecipesActions from '../actions/recipe.actions';
import { Recipe } from '../recipes/recipe.model';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://recipe-book-database-d894d-default-rtdb.firebaseio.com/recipes.json'
      );
    }),
    map((recipes) => {
      return recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map((recipes) => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  saveRecipes = this.actions.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => { //prvi element niza je pozvana akcija a drugi je niz koji smo napravili opertorom withLatestFrom
      return this.http.put(
        'https://recipe-book-database-d894d-default-rtdb.firebaseio.com/recipes.json',
        recipesState.recipes
      );
    })
  );
  constructor(private actions: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
