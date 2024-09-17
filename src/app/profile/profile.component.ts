import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user:any;

  isEditing:boolean = false;

  token= JSON.parse(localStorage.getItem('Userdata'))._token;

  userProfile

  constructor(private fb:FormBuilder,
              private router:Router,
              private activatedRoute:ActivatedRoute,
              private _authService:AuthService){}

  profileForm:FormGroup;


  ngOnInit(){
    //construction of the reactive form 
    this.profileForm = this.fb.group({
      name: [null,[Validators.required,Validators.pattern(/^[a-zA-Z ]*$/)]],
      photo: [null,[Validators.required]]
    })

    this._authService.profileInfo.subscribe((res)=>{
      this.userProfile = res;
      this.profileForm.setValue({
        name:res.displayName,
        photo:res.photoUrl
      })
    })

    //getting the snapshot of the activated route here 
    this.activatedRoute.queryParamMap.subscribe(res=>{
      console.log(res.get('edit'))
      let qParams= res.get('edit');

      if(qParams !=null){
        this.isEditing=true;
      }
      else{
        this.isEditing=false;
      }
    })

    

  }

  //switch the editing mode of the profile edit page of the user.
  editProfile(){
    this.isEditing = true;
  }
  //discard the submitted form if you dont want to change the changes
  noEditProfile(){
    this.isEditing = false;
    // this.profileForm.reset();
    this.router.navigate([],{queryParams:{edit:null}});
    console.log('helloksihvytfsyud');
  }

  //On submit this method will be called
  OnProfileFormSubmit(){
    // console.log(this.profileForm.value)
    // this.user= this.profileForm.value;
    // console.log(this.user)

    //getting the token of the user
    const body= { token:this.token  , ...this.profileForm.value}
    console.log(body);


    //send the user data to update the data of the user. name and image url will be uploaded. 
    //token will be extracted from the localstorage 
    this._authService.userProfile(body).subscribe(
      (res)=>{
        // console.log(res) 
      this.profileForm.reset(),
      this.isEditing = false;

      console.log(res);
      this._authService.getUserProfile(this.token)
      },
      (err)=>{console.log(err)}
      )

      //getting the data of the updated user by calling the authService
      this._authService.profileInfo.subscribe((res)=>{
        console.log(res);
        this.user = res;
      })
  }
console.log("value")
  onUpdateProfile(){}



}
