import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

import { Recipe } from "../recipes/recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shoppinglist.service";

import { Store } from "@ngrx/store";
import * as ShoppingListActions from '../actions/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService{

    recipesChanged = new Subject<Recipe[]>();

    constructor(private shoppingListService: ShoppingListService, private store: Store<fromApp.AppState>){}

    // private recipes: Recipe[]=[
    //     new Recipe('Chorizo Mozarella Gnocchi', 
    //     'This is a great recipe',
    //     'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&webp=true&resize=375,341'
    //     ,[
    //         new Ingredient('Mozarella', 2),
    //         new Ingredient('Tomatoes', 5)
    //     ]),
    //     new Recipe('French Toast', 
    //     'Sweet and nice',
    //     'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F43%2F2022%2F03%2F08%2F7016-french-toast-mfs-011.jpg'
    //     ,[
    //         new Ingredient('Butter', 1),
    //         new Ingredient('Honey', 5)
    //     ]
    //     )
    //   ];

    private recipes: Recipe[]=[];
    
      setRecipes(recipes: Recipe[]){
          this.recipes = recipes;
          this.recipesChanged.next(this.recipes.slice());
      }

      getRecipes(){
          return this.recipes.slice(); //koristi se slice jer se tako obezbedjuje rad sa kopijom koja se vraca preko get metode
                                       // a ne radi se direktno nad objektom tj nizom recepata(kako bi bilo bez toga) - time se obezbedjuje enkapsulacija
      }
      getRecipe(id : number){
        return this.recipes[id];
    }

      addIngredientsToShoppingList(ingredients:Ingredient[]){
          //this.shoppingListService.addIngredients(ingredients);
          this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
      }

    //   addRecipe(recipe: Recipe){ ** staro
    //       this.recipes.push(recipe);
    //       this.recipesChanged.next(this.recipes.slice());
    //   }
    //   updateRecipe(index:number, newRecipe: Recipe){
    //     this.recipes[index] = newRecipe;
    //     this.recipesChanged.next(this.recipes.slice());
    // }

    //  deleteRecipe(index:number){
    //     this.recipes.splice(index, 1);
    //     this.recipesChanged.next(this.recipes.slice());
    // }
    
}