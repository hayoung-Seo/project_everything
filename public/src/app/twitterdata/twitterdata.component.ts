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
    //TODO : activate this to get twitter data
    this.get_popular_tweets();
    this.get_recent_tweets();

    //TODO : change time interval!!
    // const TIME_INTERVAL = 7000;
    // setInterval(() => {
    //   this.get_recent_tweets();
    // }, TIME_INTERVAL);
  }

  get_recent_tweets() {
    console.log("--getting recent tweets");
    let obs = this._httpService.get_recent_tweets(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while accessing recent tweets about ",this.team);
      } else {
        // console.log("--got recent tweets data:",data);
        this.recent_tweets = data['data']['statuses'].slice(0,10);
        this.cut_tweets(this.recent_tweets, 20, 60);
      }
    })
  }

  get_popular_tweets() {
    let obs = this._httpService.get_popular_tweets(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while accessing popular tweets about ",this.team);
      } else {
        // console.log("--got populat tweets data:",data);
        this.select_popular_tweets(data['data']['statuses'], 3);
        this.cut_tweets(this.popular_tweets, 20, 300);
      }
    })
  }

  // sort popular tweets by number of likes and get top 3.
  select_popular_tweets(tweets, num_pop_tweets) {
    for (let tweet of tweets) {
      // console.log("fav count:",tweet.favorite_count, typeof(tweet.favorite_count))
    }
    tweets = tweets.sort((a,b) => (a.favorite_count < b.favorite_count)? 1 : -1);
    this.popular_tweets = tweets.slice(0, num_pop_tweets);
  }

  // cutdown username and text if it's too long
  cut_tweets(tweets, max_name_len, max_content_len) { 
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
