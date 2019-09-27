import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as io from 'socket.io-client';
import {Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // private url = 'http://localhost:8000';
  readonly url : string = "http://localhost:8000";
  socket: any;
  name: any;

  NEWS_API_KEY = '07013fad55a047e3891be41d8a68c908';
  curUser : any;
  // allUserNames = [];

  constructor(private _http : HttpClient) {
    this.socket= io(this.url);
    // this.name="Kushal"
  }

  // FOR KUSHAL : save user information in http.service (once user logged in)
  save_user(data) {
    this.curUser = data;
    // this.allUserNames.push(this.curUser.first_name);
    console.log("--curUser in http.service.ts: ", this.curUser);
    // console.log("--allUserNames in http.service.ts:", this.allUserNames);
  }

  is_logged_in() {
    return this._http.get('/login');
  }

  user_login(data) {
    // console.log("-user_login at service with data:", data);
    return this._http.post('/login', data);
  }

  get_user(email) {
    return this._http.get(`/users/${email}`);
  }

  add_user(data) {
    return this._http.post('/users', data);
  }

  get_all_users() {
    return this._http.get('/users');
  }

  // set the logged in user's favorite team
  set_favorite_team(email, data) {
    return this._http.patch(`/users/${email}`, data);
  }
  
  // listen to any emits from the backend
  listen(event_name){
    console.log("inside listen in service")
    return new Observable((subscriber)=>{
      this.socket.on(event_name, (data)=>{
        // console.log("--here:", data);
        subscriber.next(data); 
      })
    })
  }

  // emit to the backend socket
  emit(event_name, data){
    this.socket.emit(event_name, data);
  }

  // get recent news about the team from google news api
  get_recent_news(team) {
    // console.log("--google news api");
    return this._http.get(`https://newsapi.org/v2/everything?q='${team}'&apiKey=${this.NEWS_API_KEY}&sortby=publishedAt`);
  }

  // get recent tweets about the team (team name in the hashtag) from twitter api
  get_recent_tweets(team) {
    return this._http.get(`twitter/recent/${team}`);
  }

  // get popular tweets about the team (team name in the hashtage) from twitter api
  get_popular_tweets(team) {
    if (team == 'Manchester City FC') {
      team = "Manchester City";
    } else if (team == "Real Madrid CF") {
      team = "Real Madrid";
    } else if (team == "Manchester United FC") {
      team = "ManchesterUnited"
    } else if (team == "Tottenham Hotspur FC") {
      team = "TottenhamHotspur"
    } else if (team == "FC Bayern Munich") {
      team = "BayernMunich"
    }
    return this._http.get(`twitter/popular/${team}`)
  }

  // get all teams
  get_teams() {
    return this._http.get('teams');
  }

  // get team's information from mongodb
  get_team_info(team) {
    return this._http.get(`teams/${team}`)
  }

  // get matches of the team from mongodb
  get_matches(team) {
    return this._http.get(`matches/${team}`)
  }

  // logoff user
  logoff() {
    return this._http.get('logoff');
  }

  // change setting in session
  change_setting(data) {
    return this._http.post('settings/change', data);
  }

  // get change_setting from session
  get_change_setting() {
    return this._http.get('/settings/get');
  }
}
