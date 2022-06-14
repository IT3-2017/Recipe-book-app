import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from '../recipe.model';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes!: Recipe[];
  subscription!: Subscription;

  constructor(private recipeService:RecipeService, private router: Router, private route:ActivatedRoute, private store:Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.store.select('recipes').pipe( map( recipesState => {
      return recipesState.recipes;
    }))
    .subscribe(
    //this.recipeService.recipesChanged.subscribe( *
    (recipes: Recipe[]) =>{
      this.recipes = recipes;
    });
    //this.recipes = this.recipeService.getRecipes();*
  }

  onRecipeSelected(){
    this.router.navigate(['new'], {relativeTo:this.route});
  }
}
