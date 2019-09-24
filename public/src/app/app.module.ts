import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpService} from './http.service';
import {HttpClientModule} from '@angular/common/http';
import { LatestnewsComponent } from './latestnews/latestnews.component';

@NgModule({
  declarations: [
    AppComponent,
    LatestnewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
