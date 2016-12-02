import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
	selector: 'developers',
	templateUrl: 'templates/developers.html'
})

export class DevsComponent {
	constructor(http: Http){
		http.get('api/developers').subscribe(res => {
			console.error("hey", res)
		});
	}
}
