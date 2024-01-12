import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../authInterface/auth-response';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { ErrorService } from './error.service';
import { AuthUser } from '../model/auths';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user =new BehaviorSubject<AuthUser>(null);

  private tokenExpirationTimer:any;

  ApiUrl= 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  ApiKey= 'AIzaSyDtu7WiqToAvzFagtO9BaT3T6FjoryMYk4';

  constructor(private http:HttpClient,
              private _errorService:ErrorService,
              private router:Router) { }

  // ngOnInit(){
  //   this.autoSignIn();
  // }

  //signup method for the user by gettin the user data from the signup page given from the user
  signUp(email, password){
    return this.http.post<AuthResponse>(`${this.ApiUrl}${this.ApiKey}`,{
      email:email,
      password:password,
      returnSecureToken:true 
    }).pipe(
      catchError((err)=>{
        return this._errorService.handleError(err);
      }),
      tap((res)=>{
        console.log('hello');
        console.log('signUp res: ',res);
        console.log('expires: ', res.expiresIn)
        this.authenticatedUser(res.email, res.localId, res.idToken , +res.expiresIn)
      })
      )
  }

  //signIn method for the user by gettin the user data from the signup page given from the user
  signIn(email, password){
    return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.ApiKey}`,{
      email:email,
      password:password,
      returnSecureToken:true 
    }).pipe(
      catchError((err)=>{
        console.log('authservice',err);
        return this._errorService.handleError(err);
      }),
      tap((res)=>{
        console.log('hello');
        console.log('response Data: ', res)
        this.authenticatedUser(res.email, res.localId, res.idToken , +res.expiresIn)
      })
      )
  }

  //signOut method for the user to signout from the page
  signOut(){
    this.user.next(null)
    this.router.navigate([''])

    localStorage.removeItem('Userdata')

    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  //Auto signOut method for the user to signout from the page
  autoSignOut(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.signOut();
    },expirationDuration)

  }

  //Auto signOut method for the user to signout from the page
  autoSignIn(){
    const userData= JSON.parse(localStorage.getItem('Userdata'))
    if(!userData){
      return
    }
    const loggedInUser = new AuthUser(userData.email,userData.id , userData._token , new Date(userData._tokenExpirationDate))
    if(loggedInUser.token){
      this.user.next(loggedInUser);

      const expirationduration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expirationduration);
    }

  }

  //data of the authenticateduser to check the authentication of that particular user
  private authenticatedUser(email,userid,token,expiresIn){

    console.log(expiresIn);

    const expires = new Date(new Date().getTime() + expiresIn*1000)
    console.log(expires);
    const user = new AuthUser(email,userid,token,expires);
    console.log('const user: ',user);
    this.user.next(user);
    console.log('Authenticated user: ',this.user);

    console.log('authenticated user : hello')

    this.autoSignOut(expiresIn * 1000)

    localStorage.setItem('Userdata',JSON.stringify(user))
  }

  //post request for uploading the data of the user here
  userProfile(body){
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.ApiKey}`, {
      idToken: body.token,
      displayName: body.name,
      photoUrl: body.photo,
      returnSecureToken: true
    }).pipe(
      catchError((err)=>{
        console.log('authservice',err);
        return this._errorService.handleError(err);
      })
      )
  }

  // getting the user data from the firebase server using the get method
  getUserProfile(tokenId){
    return this.http.get(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.ApiKey}`).pipe(
      catchError((err)=>{
        console.log(err);
      return this._errorService.handleError(err);
    }))
  }



}
