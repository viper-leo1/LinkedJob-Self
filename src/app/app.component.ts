import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'LinkedJob';

  constructor(private _authService:AuthService){}

  ngOnInit(){
    this._authService.autoSignIn();
  }
}
