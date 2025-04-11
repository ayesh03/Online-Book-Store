import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, AppComponent], // Import AppComponent here
  providers: [provideHttpClient()], // Still needed for HttpClient
  //bootstrap: [AppComponent]
})
export class AppModule { }