import * as ShoppingListActions from '../actions/shopping-list.actions';
import { Ingredient } from '../shared/ingredient.model';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}
const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state, //spread operator koji uzima staro stanje i vraca ga ovde - svuda je dodato jer je cilj da uvek koristimo staro stanje koje je kopija pa da nad tim vrsimo izmene
        ingredients: [...state.ingredients, action.payload],
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload], // u [] smo stavili staro stanje koje je osnova i na to dodajemo novi niz koji se postavlja kao novi niz
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient, //kopija starih podataka, sva svojstva su ti sacuvana
        ...action.payload, // a ovde navodimo sta hocemo da zamenimo od vrednosti u toj kopiji, znaci sve sto treba da bude overwriten-ovano
      };
      const updatedIngredients = [...state.ingredients]; //staro stanje
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient; //mi smo izmenili kopiju starog stanja na mestu gde je bio jedan sastojak, njega smo azurirali

      return {
        ...state,
        ingredients: updatedIngredients, //ovim svuda kazemo da cemo da pregazimo postojeci niz ingredients i upisemo novi
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ingredient, ingIndex) => {
          //filter sam pravi kopiju kada radi nad podacima i uklanja one elemente koji zadovoljavaju navedeni uslov
          return ingIndex !== state.editedIngredientIndex;
        }), // u [] smo stavili staro stanje koje je osnova i na to dodajemo novi niz koji se postavlja kao novi niz
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state, //ovime vracamo i cuvamo u kopiji celo stanje, dakle i niz ingredients koji nismo ovde promenili ali ostala 2 property-ja jesmo
        editedIngredient: { ...state.ingredients[action.payload] }, //moramo da napravimo kopiju jer bismo inace radili nad originalom
        editedIngredientIndex: action.payload,
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    default:
      return state;
  }
}
