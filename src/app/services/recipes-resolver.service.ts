import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../actions/recipe.actions';

@Injectable({ providedIn: 'root' }) //ideja je da napravimo resolver, koji ce da pozove fju za pribavljanje podataka iz baze, pre nego sto se ruta ucita kako bi se prikazali detalji za recept moramo da imamo prvo ucitane recepte
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions: Actions
  ) {}

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    // const recipes = this.recipeService.getRecipes();*
    // if (recipes.length === 0) {
      //return this.dataStorageService.fetchRecipies();* // u metodi se ne subcribe-ujemo jer ce ova Angular metoda samo to da uradi za nas/ da zakljuci, prepoznaje da je to Observable koji se vraca i kada se prikupe podaci samo ih uzima
      return this.store.select('recipes').pipe(
        take(1),
        map((recipesState) => {
          return recipesState.recipes;
        }),
        switchMap((recipes) => {
          if (recipes.length === 0) {
            this.store.dispatch(new RecipeActions.FetchRecipes()); //resolver treba da daje observable ali je problem sto ovde to nemamo pa dajemo akciju kako bi se osluskivalo na njeno trigerovanje
            return this.actions.pipe(
              ofType(RecipeActions.SET_RECIPES), // osluskujemo na akciju kada znamo da ce nam prikupiti podatke/recepte
              take(1) //samo jednom nas zanima osluskivanje te akcije
            );}
            else {
                return of(recipes);
            }
        })
      );
    // } else { *
    //   return recipes;
    // }
  }
}
