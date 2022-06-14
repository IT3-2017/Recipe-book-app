import { Component,  OnDestroy,  OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ShoppingListService } from 'src/app/services/shoppinglist.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

import * as ShoppingListActions from '../../actions/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static:false})
  ourForm!: NgForm;
  subscription!: Subscription;
  editMode = false;
  editedItem!: Ingredient;
                                                              //ovo je ngRx dodatak u odnosu na Redux, gde se ubacuje STORE kao dependenz+cy injection da bismo lakse mogli da pristupamo sacuvanom state-u i podacima
  constructor(private shoppingListService:ShoppingListService, private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe( stateData =>{
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.ourForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    })
    /* this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) =>{
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.ourForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    ); */
  }

  onSubmit(form: NgForm){
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    
    if(!this.editMode){
      //this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
     } else {
       //this.shoppingListService.updateIngredient(this.editedItemIndex,newIngredient);
       this.store.dispatch(new ShoppingListActions.UpdateIngredient( newIngredient));
     }
     this.editMode = false;
     this.ourForm.reset();
  }

  onClear(){
    this.ourForm.reset();
    this.editMode = false;

    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(){
    //this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
