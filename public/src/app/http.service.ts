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
  
  constructor(private _http : HttpClient) {
    this.socket= io(this.url);
    this.name="Kushal"
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
    console.log("--google news api");
    return this._http.get(`https://newsapi.org/v2/everything?q='${team}'&apiKey=${this.NEWS_API_KEY}&sortby=publishedAt`);
  }

  // get recent tweets about the team (team name in the hashtag) from twitter api
  get_recent_tweets(team) {
    return this._http.get(`twitter/recent/${team}`);
  }

  // get popular tweets about the team (team name in the hashtage) from twitter api
  get_popular_tweets(team) {
    return this._http.get(`twitter/popular/${team}`)
  }

  // get team's information from mongodb
  get_team_info(team) {
    return this._http.get(`team/${team}`)
  }

  // get matches of the team from mongodb
  get_matches(team) {
    return this._http.get(`matches/${team}`)
  }
}
