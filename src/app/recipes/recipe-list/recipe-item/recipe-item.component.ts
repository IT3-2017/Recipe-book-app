import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input()
  recipe!: Recipe;
  @Input()
  index!: number;
  @Output() recipeSelected= new EventEmitter<void>();

  constructor(private recipeService:RecipeService, private router: Router) {
    
   }

  ngOnInit(): void {
  }
  onRecipeSelected(){
    console.log(this.index)
    this.router.navigate(['/',this.index]);
  }
}
