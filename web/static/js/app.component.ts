import { Component } from '@angular/core';

@Component({
	selector: 'site-header',
	templateUrl: 'templates/header.html'
})
export class HeaderComponent { }

@Component({
	selector: 'app',
	template: `
		<site-header></site-header>
		<router-outlet></router-outlet>
	`
})
export class AppComponent { }
