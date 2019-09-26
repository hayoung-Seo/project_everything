import { Component, OnInit ,Output, EventEmitter} from '@angular/core';
import {HttpService} from '../http.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  teams : any;
  curUser : any;

  constructor(
    private _httpService : HttpService,
    private _route : ActivatedRoute,
    private _router: Router){

    }

  ngOnInit() {
    this.init_user();
    this.get_teams();
  }

  get_teams() {
    let obs = this._httpService.get_teams();
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--error while getting all teams data")
        // console.log("--error: ", data['error']);
      } else {
        this.teams = data['data'];
      }
    })
  }

  init_user() {
    this.curUser = {email:""};
    let obs = this._httpService.is_logged_in();
    obs.subscribe(data => {
      if (data['loggedin']) {
        // console.log("--data:", data);
        this.curUser['email'] = data['email'];
      } else {
        // console.log("user not logged in");
      }
    })
  }

  select_team(team_name) {
    let obs = this._httpService.set_favorite_team(this.curUser.email, {'team':team_name});
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error undating user:", data['error']);
      } else {
        // console.log("updated user:", data['data']);
        console.log("--got all teams data");
        this.curUser = data['data'];
        let obs2 = this._httpService.change_setting({flag:false});
        obs2.subscribe(data2 => {
          console.log("--here");
          // console.log("selected team and let's go back to main");
          // this._router.navigate(['/']);
          this.eventEmitter.emit();
        })
      }
    })
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
    })
  }
}
