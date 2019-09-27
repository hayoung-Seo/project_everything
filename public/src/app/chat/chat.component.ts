import { Component, OnInit, AfterViewInit } from '@angular/core';
import {HttpService} from '../http.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewInit {
  chat:any;
  all_chat: any;
  all_users: any;
  new_user:any;
  container: HTMLElement;



  constructor( private  _httpService: HttpService) {
    this.all_chat=[];
    this.chat={name:'', msg:''}
    this.all_users=[];
    this.new_user={name:''}
  }

  

  ngAfterViewInit() {
    this.send_new_user();
    this.get_back_msg()
    this.chat.name=this._httpService.curUser
    this.get_all_users()
    this.get_updated_all_users();
    this.container = document.getElementById("msgContainer");        console.log("-container:", this.container);
    console.log("-[before]this.container.scrollTop:", this.container.scrollTop);
    this.container.scrollTop = this.container.scrollHeight;  
    console.log("-[after]this.container.scrollTop:", this.container.scrollTop);  
  }



  send_new_user(){

    this.new_user.name=this._httpService.curUser;
    this._httpService.emit('got_new_user',this.new_user);
  }

  get_all_users(){
    this._httpService.listen('existing_users').subscribe((data)=>{
      console.log('this is all the existing users send back from server: ' + data);
      this.all_users = data;
    })
  }

  send_new_msg(){
    this.container = document.getElementById("msgContainer");        console.log("-container:", this.container);
    console.log("-[before]this.container.scrollTop:", this.container.scrollTop);
    this.container.scrollTop = this.container.scrollHeight;  
    console.log("-[after]this.container.scrollTop:", this.container.scrollTop);  
    
    // this.all_chat.push(this.chat)
    this._httpService.emit('this_chat', this.chat)
    this.chat.msg='';
  }

  get_back_msg(){
    this._httpService.listen('all_chat_rtn').subscribe((data)=>{
      this.all_chat=data;
      // console.log("get returned data: "+this.all_chat)
    }) 
  }
  
  get_updated_all_users(){
    this._httpService.listen('updated_all_users').subscribe((data)=>{
      console.log("this is the updated user list after disconnect: "+ data)
      this.all_users=data
    })
  }


}
 