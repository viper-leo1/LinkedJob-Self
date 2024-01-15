import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'top-menu',
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.css'
})
export class TopMenuComponent {

  isLogged:boolean = false;

  userProfile

  constructor(private _authService:AuthService){
    this._authService.profileInfo.subscribe((res)=>{
      this.userProfile=res;
    })
  }

  ngOnInit(){
    this._authService.user.subscribe(res=>{
       this.isLogged= res ? true: false; 
    })
  }

  onSignOut(){
    this._authService.signOut();
  }

  OnRegisterClicked(){
    this.isLogged=false;
  }
  
}
