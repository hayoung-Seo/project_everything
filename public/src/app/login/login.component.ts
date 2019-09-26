import { Component, OnInit,  Output, EventEmitter } from '@angular/core';
import {HttpService} from '../http.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  loginUser : any;
  error : any;
  
  constructor(
    private _httpService : HttpService,
    private _route : ActivatedRoute,
    private _router: Router){
    }

  ngOnInit() {
    this.init_login_user();
  }

  init_login_user() {
    this.loginUser = {email :"", password:""};
  }

  login_user() {
    // try logging in user
    let obs = this._httpService.user_login(this.loginUser);
    obs.subscribe(data => {
      if (data['error']) {
        this.error = data['error'];
        // console.log("--error while logging in a user :", this.loginUser.email);
        // console.log("--error: ", data['error']);
      } else {
        // console.log("--user logged in:", data);
        // user logged in. go back to app comp.
        this.eventEmitter.emit();
      }
    })
  }

}
