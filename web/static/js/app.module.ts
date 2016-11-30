import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, HeaderComponent }   from './app.component';

import { Routes, RouterModule } from '@angular/router';
import { DevsComponent } from './devs.component';

const routes: Routes = [
	{path: '**', redirectTo: '/developers', pathMatch: 'full'},
	{path: 'developers', component: DevsComponent}
];

@NgModule({
  imports: [
	  BrowserModule,
	  RouterModule.forRoot(routes)
  ],
  declarations: [
	  AppComponent,
	  DevsComponent,
	  HeaderComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
