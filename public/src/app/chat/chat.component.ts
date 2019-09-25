import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: any;
  constructor( private  _httpService: HttpService) { }

  ngOnInit() {
    this.message = "";
    console.log("--init");
    this.listen_to_service()

    this.send_msg()

  }
  testButton(){
    console.log(this.message);
  }
  listen_to_service(){
      this._httpService.listen('test_event').subscribe((data)=>{
        console.log("--in listen to server`"+data)
        this.message = data;
      })
    //   console.log("--in listern_to_service()");
    //   this._httpService.listen('test_event').subscribe(value => {
    //     console.log("--value:",value);
    //   }, err => {console.error("Opps", err.message);
    // }, () => {
    //   console.log("we're done here!");
    // });
    // this._httpService.listen('test_event');
  }

  send_msg(){
    // this.listen_to_service();
    this._httpService.emit('hello',"How are you doins?");
  }

}
