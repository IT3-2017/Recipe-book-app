import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from '../recipe.model';
import { map, switchMap } from 'rxjs';
import * as RecipesActions from '../../actions/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe!: Recipe;
  id!: number;

  constructor(private recipeService:RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params =>{
        return +params['id'];
      }), 
      switchMap( id =>{
        this.id = id;
        return this.store.select('recipes');
      }),
      map( recipesState =>{
        return recipesState.recipes.find((recipe, index) =>{
          return index === this.id;
        })
      })
    ).subscribe(
      recipe =>{
        this.recipe = recipe;
      }
    )
    // this.route.params.subscribe( * staro
    //   (params: Params) =>{
    //     this.id = +params['id'];
    //     this.recipe = this.recipeService.getRecipe(this.id);
    //   }
    // )
  }

  onGoToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo:this.route});
  }

  onDeleteRecipe(){
    //this.recipeService.deleteRecipe(this.id);*
    this.router.navigate(['/recipe']);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
  }
}
