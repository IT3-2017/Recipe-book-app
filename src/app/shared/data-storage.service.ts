import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap, take, map, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../actions/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  saveRecipies() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://recipe-book-database-d894d-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => {
        console.log(response); //ove smo se subscribe-ovali ali mogli smo i u komponenti (ima vise smisla ovde jer je PUT zahtev)
      });
  }

  fetchRecipies() {
    return this.http.get<Recipe[]>(
          'https://recipe-book-database-d894d-default-rtdb.firebaseio.com/recipes.json',
        ).pipe(
          map((recipes) => {
            return recipes.map((recipe) => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : [],
              };
            });
          }),
          tap((recipes) => {
            //this.recipeService.setRecipes(recipes);
            this.store.dispatch(new RecipesActions.SetRecipes(recipes));
          })
    );

/*     return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(
          'https://recipe-book-database-d894d-default-rtdb.firebaseio.com/recipes.json',
          {
            params: new HttpParams().set('auth', user.token!)
          }
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
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      })
    ); //take operator govori da cemo uzeti samo 1 vrednost i automatski se odmah unsubscribe-ujemo */
  }
}
