import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  @Input() team ;
  team_data : any;
  matches : any;
  next_match: any;
  prev_match: any;
  constructor(
    private _httpService : HttpService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this.get_team_info();
    this.get_matches();
  }

  get_team_info() {
    let obs = this._httpService.get_team_info(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while getting the team data",this.team);
      } else {
        // console.log("--got team data:",data['data']);
        this.team_data = data['data'];
      }
    })
  }

  // get matches of the team from mongoDb
  get_matches() {
    let obs = this._httpService.get_matches(this.team);
    obs.subscribe(data => {
      if (data['error']) {
        // console.log("--got error while getting match data",this.team);
      } else {
        // console.log("--got matches data:",data);
        this.matches = data['data'];
        this.update_match_date();
        this.set_prev_next_match();
        // console.log("--previous match: ", this.prev_match);
        // console.log("--next match: ", this.next_match);
      }
    })
  }

  // select previous match and next match from all matches
  set_prev_next_match() {
    // find the first match with finished=False
    for (let i = 0; i <this.matches.length; i++) {
      let match = this.matches[i];
      if (match['finished'] == "False") {
        this.next_match = match;
        if (i > 0) {
          this.prev_match = this.matches[i-1];
        } else {
          // console.log("--no previous match available..");
        }
        break;
      }
    }
  }

  // match data has only date/month part for match_date. add year
  update_match_date() {
    for (let match of this.matches) {
      match['match_date'] = match['match_date'] + "/2019";
    }
  }
}
