import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  handleError(err:HttpErrorResponse){
    console.log('errorservice',err);
    if(!err.error || !err.error.error){
      return throwError(this.errorMsgs['UNKNOWN'])
    }else{
      console.log(err.error.error.message)
      return throwError(this.errorMsgs[err.error.error.message])
    }
  }

  errorMsgs = {
    UNKNOWN : 'An Unknown error is occured',

    EMAIL_EXISTS: 'The email address is already in use by another account.',
    OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
    EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier. The user may have been deleted.',
    INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
    USER_DISABLED: 'The user account has been disabled by an administrator.',
    INVALID_LOGIN_CREDENTIALS : 'The email address or password is incorrect.',
    INVALID_ID_TOKEN:'The user credential is no longer valid. The user must sign in again.',
    WEAK_PASSWORD: 'The password must be 6 characters long or more.'
    
    
  }
}
