import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor( private  _httpService: HttpService) { }

  ngOnInit() {
  }

}
