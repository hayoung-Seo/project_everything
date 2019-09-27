import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpService} from './http.service';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LatestnewsComponent } from './latestnews/latestnews.component';
import { ChatComponent } from './chat/chat.component';
import { TwitterdataComponent } from './twitterdata/twitterdata.component';
import { MatchComponent } from './match/match.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './register/register.component';
import {NgxAutoScrollModule} from 'ngx-auto-scroll';


@NgModule({
  declarations: [
    AppComponent,
    LatestnewsComponent,
    ChatComponent,
    TwitterdataComponent,
    MatchComponent,
    LoginComponent,
    SettingsComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxAutoScrollModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
