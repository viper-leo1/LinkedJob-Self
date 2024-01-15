import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{

  passwordForm:FormGroup;

  passwordChanged:boolean=false;

  token= JSON.parse(localStorage.getItem('Userdata'))._token;

  constructor(private fb:FormBuilder,
              private _authService:AuthService,
              private router:Router){}

  ngOnInit(){
    this.passwordForm = this.fb.group({
      newPassword:[null, [Validators.required, Validators.minLength(6)]]
    })
  }

  onformSubmit(){
    const userResponse = window.confirm('Do you want to change password??');
    if(userResponse){
      console.log('new passowrd value: ',this.passwordForm.value.newPassword);
      const password = this.passwordForm.value.newPassword
      this._authService.changePassword(this.token,password).subscribe((res)=>{
        console.log(res);
        this.passwordChanged = true;
        alert('You have successfully reset your password and Login again!!!')
        this._authService.signOut();
        this.router.navigate([''])
      },(err)=>{console.log(err)})

    }
    // console.log('meowwwwww')

  }

  onEmptyForm(){
    if(this.passwordForm.invalid){
      alert('Please enter new Password to change the passowrd!!');
    }
  }

}
