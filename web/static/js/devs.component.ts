import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HTTP_PROVIDERS, Http } from '@angular/http';

@Component({
	selector: 'developers',
	templateUrl: 'templates/developers.html'
})

export class DevsComponent {
	devs: Object[];
	http: Http;
	constructor(private http_client: Http){
		this.http = http_client;
		this.refresh();
	}
	refresh(){
		this.http.get('api/developers').subscribe(res => {
			this.devs = res.json();
		});
	}
	add_edit(){
		this.http.post('api/developers', {email: "a new email"}).subscribe(res => {
			this.refresh();
		});
	}
}
