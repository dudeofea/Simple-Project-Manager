import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, HeaderComponent }   from './app.component';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { DevsComponent } from './devs.component';

const routes: Routes = [
	{path: '**', redirectTo: '/developers', pathMatch: 'full'},
	{path: 'developers', component: DevsComponent}
];

@NgModule({
  imports: [
	  BrowserModule,
	  RouterModule.forRoot(routes),
	  HttpModule
  ],
  declarations: [
	  AppComponent,
	  DevsComponent,
	  HeaderComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
