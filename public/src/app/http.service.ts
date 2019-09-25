import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url = 'http://localhost:8000';
  private socket;


  constructor(private _http : HttpClient) {
    this.socket= io(this.url)
  }
}
