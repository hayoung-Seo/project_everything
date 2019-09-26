import { Component, OnInit, ɵSWITCH_ELEMENT_REF_FACTORY__POST_R3__ } from '@angular/core';

import {HttpService} from './http.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'public';

  login_step : boolean;
  setting_step : boolean;
  main_step : boolean;
  // change_setting_step : boolean;

  email : string;// logged in user's email
  curUser : any;
  // newUser = {"random" : 'random'}; // temp

  favorite_team : string;
  // favorite_team = "FC Barcelona"; // temp
  // favorite_team = "real madrid CF";

  constructor(
    private _httpService : HttpService,
    private _route : ActivatedRoute,
    private _router: Router){
  }
  ngOnInit() {
    //TODO : activate this.setup() and deactivate below lines
    this.setup();
    // TODO : activate this FOR TESTING
    // this.login_step = false;
    // this.setting_step = false;
    // this.main_step = true;
    // this.favorite_team = "FC Barcelona";
  }

  setup() {
    // check if user is logged in or not
    let obs = this._httpService.is_logged_in();
    obs.subscribe(data => {
      if (data['loggedin'] == true) { // user already logged in
        // console.log("--user already logged in!!");
        this.login_step = false;
        this.email = data['email'];

        // check if user has setting (favorite team)
        let obs2 = this._httpService.get_user(this.email);
        obs2.subscribe(user => {
          if (user['error']) {
            // console.log("--error while getting user data:", user['error']);
          } else {
            // console.log("--got logged in user data: ", user['data']);
            this.curUser = user['data'];
            // save user information in http.service
            this._httpService.save_user(this.curUser);
            if (this.curUser.favorite_team) {
              this.favorite_team = this.curUser.favorite_team;

              let obs3 = this._httpService.get_change_setting();
              obs3.subscribe(data => {
                // console.log("----here, data:", data);
                let flag = data['setting'];
                if (flag == true) {
                  this.setting_step = true; //this means user want to update setting
                  this.main_step = false;
                } else {
                  this.setting_step = false; // already has fav team
                  this.main_step = true; // show main page
                }
              })
            } else {
              this.setting_step = true; // show setting page
              this.main_step = false;
            }
          }
        })

      } else { // user not logged in
        // console.log("--user not logged in. show login component");
        this.login_step = true;
        this.setting_step = false;
        this.main_step = false;
      }
    })
  }
  
  user_logged_in() {
    // console.log("--get to parent from child.");

    // change steps
    this.setup();

    // console.log("this.login_step:", this.login_step);
    // console.log("this.setting_step:", this.setting_step);
    // console.log("this.main_step:", this.main_step);
  }

  settings_updated() {
    this.setup();
  }

  logoff() {
    let obs = this._httpService.logoff();
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while logging off");
        
      } else {
        // console.log("--logging out", data['data']);
        // this._router.navigate(["/"]);
      }
      this.login_step = true;
      this.setting_step = false;
      this.main_step = false;
    })
  }

  // go to setting page so user can change their favorite team
  change_setting() { // save some variable in session
    let obs = this._httpService.change_setting({flag:true});
    obs.subscribe(data => {
      if (data['setting_change'] == true) {
        // console.log("allowed user can change the setting");
        this.login_step = false;
        this.setting_step = true;
        this.main_step = false;
      } else {
        // console.log("some unknown error..");
      }
    })
  }
}
