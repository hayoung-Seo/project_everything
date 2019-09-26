import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chat:any;
  message: any;
  rtn_msg: any;
  all_chat: any;
  all_users: any;
  constructor( private  _httpService: HttpService) {
    this.message={msg: '' };
    this.rtn_msg='';
    this.all_chat=[];
    this.chat={name:'', msg:''}
    this.all_users={};
      
  }

  ngOnInit() {
    // this.message = "";
    this.send_new_user();
    this.get_back_msg()
    this.chat.name=this._httpService.name
    this.get_all_users()
  }



  send_new_user(){
    this._httpService.emit('got_new_user',this._httpService.name);
  }

  get_all_users(){
    this._httpService.listen('existing_users').subscribe((data)=>{
      console.log("this is all the existing users send back from server: "+ data)
      this.all_users=data
    })
  }

  send_new_msg(){
    this.all_chat.push(this.chat)
    this._httpService.emit('this_chat', this.chat)
    this.message.msg='';
  }

  get_back_msg(){
    this._httpService.listen('all_chat_rtn').subscribe((data)=>{
      this.all_chat=data;
      // console.log("get returned data: "+this.all_chat)
    }) 
  }
  


}
 