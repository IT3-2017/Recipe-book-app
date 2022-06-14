import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../auth/auth-guard";
import { RecipesResolverService } from "../services/recipes-resolver.service";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    {
        path: '',
        component: RecipesComponent,
        canActivate:[AuthGuardService],
        children: [
          { path: '', component: RecipeStartComponent },
          { path: 'new', component: RecipeEditComponent }, //moramo prvo ovu rutu pa posle onu sa ID-em jer ce u suprotnom pucati kod
          // kako ce Angular ocekivati ID a dobija rec 'new' i one zna kako da ucita podatke
          {
            path: ':id',
            component: RecipeDetailComponent,
            resolve: [RecipesResolverService],
          },
          {
            path: ':id/edit',
            component: RecipeEditComponent,
            resolve: [RecipesResolverService],
          },
        ],
      }
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRouting{

}