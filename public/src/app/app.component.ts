import { Component } from '@angular/core';

import {HttpService} from './http.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'public';

  favorite_team = "FC Barcelona";
  // favorite_team = "real madrid CF";
  constructor(private _httpService : HttpService){}

}
