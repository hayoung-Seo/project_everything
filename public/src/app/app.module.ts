import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpService} from './http.service';
import {HttpClientModule} from '@angular/common/http';
import { LatestnewsComponent } from './latestnews/latestnews.component';
import { TwitterdataComponent } from './twitterdata/twitterdata.component';
import { MatchComponent } from './match/match.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './register/register.component';

import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LatestnewsComponent,
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
    FormsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
