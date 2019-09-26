import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-latestnews',
  templateUrl: './latestnews.component.html',
  styleUrls: ['./latestnews.component.css']
})
export class LatestnewsComponent implements OnInit {

  @Input() team ;
  recent_news : any;
  constructor(
    private _httpService : HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    //TODO: activate this to get latest news data
    // this.get_recent_news();
  }

  get_recent_news() {
    let obs = this._httpService.get_recent_news(this.team);
    obs.subscribe(data => {
      if (data['status'] == "error") {
        // console.log("--error while getting news for ", this.team);
      } else {
        this.select_news(data['articles'],3);
        // console.log("--got recent news data : ", this.recent_news);
        this.cut_description();
      }
    })
  }

  select_news(news, num_news) {
    this.recent_news = []; 
    let cnt = 0;
    for (let x of news) {
      if (x.urlToImage != undefined) {
        this.recent_news.push(x);
        cnt++;
      }
      if (cnt >= num_news) {
        break;
      }
    }
  }

  cut_description() {
    for (let news of this.recent_news) {
      // cut description down to 20 words
      news['description'] = news['description'].split(' ').slice(0,15).join(" ");
    }
  }
}
