import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService{
     ingredientsChanged = new Subject<Ingredient[]>();
     startedEditing = new Subject<number>();

    private ingredients: Ingredient[]=[
        new Ingredient ('Apples',5),
        new Ingredient ('Tomatoes', 10)
      ];

    emitEvent(){
      this.ingredientsChanged.next(this.ingredients.slice());
    }
    getIngredients(){
        return this.ingredients.slice();
    }

    getIngredient(index:number){
      return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient);
        this.emitEvent();
      }

    addIngredients(ingredients: Ingredient[]){
        // for (let i of ingredients){
        //   this.addIngredient(i); //mnogo puta se emituje event na poziv fje servisa pa je los primer, bolji je onaj ispod
        // }

        this.ingredients.push(...ingredients); // operator ... ce samo konvertovati nas niz elemenata u listu jer ce inace push metoda
                                                //da doda ceo niz kao jedan novi element a ovako ih razdvoji i po jedan upisuje, kao kako bismo putem petlje
        this.emitEvent();
      }

    updateIngredient(index:number, newIngredient:Ingredient){
      this.ingredients[index] = newIngredient;
      this.emitEvent();
    }

    deleteIngredient(index:number){
      this.ingredients.splice(index, 1);
      this.emitEvent();
    }
}