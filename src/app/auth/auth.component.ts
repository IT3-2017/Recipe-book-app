import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../dynamic components/alert/alert.component';
import { AuthResponseData, AuthService } from '../services/auth.service';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directives';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../actions/auth.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  animations: [
    trigger('divAnimation', [
      state('state1',style({
        background:"url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMAXAIAm729KG_6nMOEeu2XP8qrCdvlJa7AJDimMqBRKeSRgQoXT2Tt7fu31XnnsYjN9M&usqp=CAU')",
      transform: 'translateX(0)'
      })),
      state('state2', style ({
        background:"url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVlKFDJ_3u4bV3jQpmLfeIUF7UMTDQBeSHnyVG77LQ7yIEbvZWB3HNiyfLtAxCLbNIEOw&usqp=CAU')",
        transform: 'translateX(100px)'
      })),
      transition('state1 <=> state2', animate(1000)),
      transition('state2 => state1',[
        style({ 'background-color': '#049f94'}), 
        animate(800, style({
          borderRadius: '50px'
        })),
        animate(800)
      ])
    ])
  ]
})
export class AuthComponent implements OnInit,OnDestroy {
  state="state1";
  isLoggedIn = true;
  isLoading = false;
  errorMessage: string = '';
  private closeSub: Subscription;
  private storeSub: Subscription;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective; //trazi prvu pojavu direktive pod ovim nazivom u templejtu ove komponente
  //pristupamo nasoj direktivi i cuvamo je u ovoj varijabli
  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    
    this.storeSub = this.store.select('auth').subscribe(
      authState =>{
        this.isLoading = authState.loading;
        this.errorMessage = authState.authError;
        if(this.errorMessage){
          this.showErrorAlert(this.errorMessage);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoggedIn = !this.isLoggedIn;
    //transformacija
    this.state == "state1"? this.state="state2":this.state = "state1";
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    let authObservable: Observable<AuthResponseData>;

    if (this.isLoggedIn) {
      //authObservable = this.authService.login(email, password); *
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
    } else {
      //authObservable = this.authService.signUp(email, password); *
      this.store.dispatch(new AuthActions.SignUpStart({email: email, password: password}));
    }
    // authObservable.subscribe( ****
    //   (response) => {
    //     console.log(response);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipe']);
    //   },
    //   (errorMessage) => {
    //     console.log(errorMessage);
    //     this.errorMessage = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );
    form.reset();
  }

  onHandleError() {
    //this.errorMessage = null; *
    this.store.dispatch(new AuthActions.ClearError());
  }

  showErrorAlert(message: string) {
    //metoda drugog pristupa koja dinamicki kreira nasu komponentu
    const alertCompFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContinerReference = this.alertHost.viewContainerRef;

    hostViewContinerReference.clear();
    const componentRef =
      hostViewContinerReference.createComponent(alertCompFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContinerReference.clear(); //obrisace svaki sadrzaj koji se nalazio na tom mestu u DOM-u
    });
  }
}
