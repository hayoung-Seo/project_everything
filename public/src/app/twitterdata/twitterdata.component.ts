import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-twitterdata',
  templateUrl: './twitterdata.component.html',
  styleUrls: ['./twitterdata.component.css']
})
export class TwitterdataComponent implements OnInit {

  @Input() team ;
  recent_tweets : any;
  popular_tweets : any;
  constructor(
    private _httpService : HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    // this.get_popular_tweets();
    // this.get_recent_tweets();

    //TODO : change time interval!!
    // const TIME_INTERVAL = 7000;
    // setInterval(() => {
    //   this.get_recent_tweets();
    // }, TIME_INTERVAL);
  }

  get_recent_tweets() {
    let obs = this._httpService.get_recent_tweets(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        console.log("--got error while accessing recent tweets about ",this.team);
      } else {
        console.log("--got recent tweets data:",data);
        this.recent_tweets = data['data']['statuses'].slice(0,10);
        this.cut_tweets(this.recent_tweets, 20, 60);
      }
    })
  }

  get_popular_tweets() {
    let obs = this._httpService.get_popular_tweets(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        console.log("--got error while accessing popular tweets about ",this.team);
      } else {
        console.log("--got populat tweets data:",data);
        this.popular_tweets = data['data']['statuses'].slice(0,3);
        this.cut_tweets(this.popular_tweets, 20, 300);
      }
    })
  }

  cut_tweets(tweets, max_name_len, max_content_len) { // cutdown username and text if it's too long
    for (let tweet of tweets) {
      if (tweet['user']['screen_name'].length > max_name_len) {
        tweet['user']['screen_name'] = tweet['user']['screen_name'].slice(0,max_name_len) + "..";
      }

      if (tweet['text'].length > max_content_len) {
        tweet['text'] = tweet['text'].slice(0,max_content_len) + "..";
      }

      // build url to the profile/tweet
      tweet['profile_url'] = `https://twitter.com/${tweet['user']['screen_name']}`;
      
      tweet['tweet_url'] = `https://twitter.com/${tweet['user']['screen_name']}/status/${tweet['id_str']}`;
    }
  }

}
