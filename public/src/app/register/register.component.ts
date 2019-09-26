import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {HttpService} from '../http.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  newUser : any;
  error : any;

  constructor(
    private _httpService : HttpService,
    private _route : ActivatedRoute,
    private _router: Router){

    }

  ngOnInit() {
    this.init_new_user();
  }

  init_new_user() {
    this.newUser = {first_name :"",
                    last_name : "",
                    email :"", 
                    password:"",
                    confirm_password: "",
                  };
  }

  register_user() {
    // try register user
    let obs = this._httpService.add_user(this.newUser);
    obs.subscribe(data => {
      if (data['error']) {
        // build error message
        this.build_error(data['error']);
        // console.log("--error while registering in a user :", this.newUser.email);
        // console.log("--error: ", data['error']);
      } else {
        console.log("-here");
        this.error = [];
        this.init_new_user();
        // console.log("--user registering:", data);
        this.eventEmitter.emit();
      }
    })
  }

  build_error(data) {
    if (typeof(data) == "string") { // error is string
      this.error = [data];
      return;
    } else { // error is object
      this.error = [];
      for (let property in this.newUser) {
        if (data['errors'].hasOwnProperty(property)) {
          this.error.push(data['errors'][property].message);
        }
      }
    }
  }

}
