import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';

import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { map, Subscription } from 'rxjs';
import * as RecipesActions from '../../actions/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id!: number;
  editMode = false;
  recipeForm!: FormGroup;
  private storeSub: Subscription;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router, private store: Store<fromApp.AppState>) { }
  ngOnDestroy(): void {
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        this.id = +params['id'];
        this.editMode = params['id'] !=null;//ako ne postoji parametar onda je undefind
        this.formInit();
      }
    )
  }

  private formInit(){
    let recipeName='';
    let recipeImagePath='';
    let recipeDescription='';
    let recipeIngredients = new FormArray([]);

/*     recipeName = this.editMode? this.recipeService.getRecipe(this.id).name : ''; ***staro
    recipeImagePath = this.editMode? this.recipeService.getRecipe(this.id).imagePath : '';
    recipeDescription = this.editMode? this.recipeService.getRecipe(this.id).description : ''; */

    if(this.editMode){
      //const recipe = this.recipeService.getRecipe(this.id); *
      this.storeSub = this.store.select('recipes').pipe(
        map( recipesState =>{
          return recipesState.recipes.find((recipe, index)=>{
            return index === this.id;
          });
        })
      ).subscribe( recipe =>{
        if(recipe['ingredients']){
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          for(let ingredient of recipe.ingredients){
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]) //ovo je factory, izvrsavamo fju kako bi se konfigurisao validator
              })
            )
          }
        }
      })
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients

    });
  }

  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onSubmit(){
 
    if(this.editMode){
      //this.recipeService.updateRecipe(this.id,this.recipeForm.value); *
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}));
    } else {
      //this.recipeService.addRecipe(this.recipeForm.value); *
      this.store.dispatch(new RecipesActions.AddRecipe( this.recipeForm.value));
    }
    this.onCancel();
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }

  onDeleteIngredient(i: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
  }
}
