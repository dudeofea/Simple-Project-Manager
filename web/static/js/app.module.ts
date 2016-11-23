import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { Routes, RouterModule } from '@angular/router';
import { DevsComponent } from './devs.component';

const routes: Routes = [
	{path: 'developers', component: DevsComponent}
];

@NgModule({
  imports: [
	  BrowserModule,
	  RouterModule.forRoot(routes)
  ],
  declarations: [
	  AppComponent,
	  DevsComponent
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
